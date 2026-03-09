import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import sanitizeHtml from "sanitize-html";

import FloatingParticles from "@/components/FloatingParticles";
import { siteConfig } from "@/lib/site";
import { getMediumArticleBySlug, getMediumArticles } from "@/lib/medium";
import { summarizeTextWithProviderCached } from "@/lib/ai";
import ShareButton from "./ShareButton";
import ReadingProgress from "./ReadingProgress";
import ReadingTimeLeft from "./ReadingTimeLeft";
import CodeBlocksEnhancer from "./CodeBlocksEnhancer";

import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function decodeBasicEntities(input: string): string {
  return input
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function stripHtml(html: string): string {
  const withoutFigcaptions = html.replace(
    /<figcaption>[\s\S]*?<\/figcaption>/gi,
    " ",
  );
  const withoutTags = withoutFigcaptions.replace(/<[^>]+>/g, " ");
  const decoded = decodeBasicEntities(withoutTags);
  return decoded.replace(/\s+/g, " ").trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const sliced = text.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(" ");
  return (
    (lastSpace > 160 ? sliced.slice(0, lastSpace) : sliced).trimEnd() + "…"
  );
}

function estimateReadTimeFromText(text: string): string {
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function takeFirstSentences(
  text: string,
  maxSentences = 3,
  maxChars = 520,
): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  const out: string[] = [];
  // Split on end-of-sentence punctuation followed by whitespace.
  const parts = cleaned.split(/(?<=[.!?])\s+/);
  for (const p of parts) {
    const s = p.trim();
    if (!s) continue;
    out.push(s);
    const combined = out.join(" ");
    if (out.length >= maxSentences) return combined;
    if (combined.length >= maxChars && out.length >= 2) return combined;
  }

  return out.join(" ");
}

function extractHeadings(html: string, max = 8): string[] {
  const out: string[] = [];
  const re = /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(re)) {
    const text = stripHtml(match[2] ?? "");
    if (!text) continue;
    if (out.includes(text)) continue;
    out.push(text);
    if (out.length >= max) break;
  }
  return out;
}

function extractParagraphs(html: string, maxChars = 2600): string {
  const withoutFigures = html.replace(/<figure>[\s\S]*?<\/figure>/gi, " ");
  const withoutPre = withoutFigures.replace(/<pre>[\s\S]*?<\/pre>/gi, " ");
  const paragraphs = Array.from(
    withoutPre.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi),
  ).map((m) => stripHtml(m[1] ?? "").trim());

  const picked: string[] = [];
  let total = 0;
  for (const p of paragraphs) {
    if (!p) continue;
    if (p.length < 40) continue;
    const lower = p.toLowerCase();
    if (lower.startsWith("photo by ")) continue;
    if (lower.startsWith("image by ")) continue;
    if (lower.includes("medium.com")) continue;

    // Never cut mid-paragraph; stop before exceeding the budget.
    if (total + p.length > maxChars) break;
    picked.push(p);
    total += p.length;
  }

  return picked.join("\n\n").trim();
}

function extractLeadFigure(html: string): {
  leadFigureHtml: string | null;
  leadImageSrc: string | null;
  leadCaptionText: string | null;
  htmlWithoutLead: string;
} {
  const figureRe = /<figure[^>]*>[\s\S]*?<\/figure>/i;
  const match = html.match(figureRe);
  if (!match) {
    return {
      leadFigureHtml: null,
      leadImageSrc: null,
      leadCaptionText: null,
      htmlWithoutLead: html,
    };
  }

  const leadFigureHtml = match[0] || "";
  const imgMatch = leadFigureHtml.match(/<img[^>]+src="([^"]+)"/i);
  const leadImageSrc = (imgMatch?.[1] || "").trim() || null;

  const captionMatch = leadFigureHtml.match(
    /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i,
  );
  const leadCaptionText = captionMatch
    ? stripHtml(captionMatch[1] || "").trim() || null
    : null;

  const htmlWithoutLead = html.replace(figureRe, " ");

  return {
    leadFigureHtml,
    leadImageSrc,
    leadCaptionText,
    htmlWithoutLead,
  };
}

function decorateMediumHtml(html: string): string {
  // Convert Medium-style photo credits into a distinct, caption-like style.
  const creditRe = /<p([^>]*)>(\s*(?:Photo|Image)\s+by[\s\S]*?)<\/p>/gi;

  const addClass = (attrs: string, className: string): string => {
    const classRe = /\sclass=("([^"]*)"|'([^']*)')/i;
    const match = attrs.match(classRe);
    if (match) {
      const existing = (match[2] || match[3] || "").trim();
      const next = existing.includes(className)
        ? existing
        : `${existing} ${className}`.trim();
      return attrs.replace(classRe, ` class="${next}"`);
    }
    return `${attrs} class="${className}"`;
  };

  return html.replace(creditRe, (_m, attrs, inner) => {
    const nextAttrs = addClass(attrs || "", "blog-credit");
    return `<p${nextAttrs}>${inner}</p>`;
  });
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getMediumArticleBySlug("aayushmohan", slug);
  if (!article) return {};

  const base = siteConfig.url.replace(/\/$/, "");
  const canonical = `/blog/${slug}`;

  const description = truncate(
    stripHtml(article.contentHtml || article.synopsis),
    160,
  );

  return {
    title: `${article.title} | ${siteConfig.name}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description,
      siteName: siteConfig.name,
      images: article.imageUrl
        ? [
            {
              url: article.imageUrl,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      creator: siteConfig.twitterHandle,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    other: {
      "x-canonical-source": article.link,
      "x-site": base,
    },
  };
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const articles = await getMediumArticles("aayushmohan");
  const articleIndex = articles.findIndex((a) => a.slug === slug);
  const article = articles[articleIndex];
  const prevArticle = articleIndex > 0 ? articles[articleIndex - 1] : null;
  const nextArticle =
    articleIndex >= 0 && articleIndex < articles.length - 1
      ? articles[articleIndex + 1]
      : null;

  if (!article) notFound();

  const contentHtml = article.contentHtml || "";
  const headings = extractHeadings(contentHtml, 8);
  const paraText = extractParagraphs(contentHtml, 2600);
  const fallbackText = stripHtml(contentHtml);
  const cleanText = paraText || fallbackText;

  const { leadImageSrc, leadCaptionText, htmlWithoutLead } =
    extractLeadFigure(contentHtml);

  const featuredImageUrl = leadImageSrc || article.imageUrl || null;

  const normalizedFeatured = featuredImageUrl
    ? featuredImageUrl.split("?")[0] || featuredImageUrl
    : null;
  let droppedFeaturedFromBody = false;

  const sanitizedContentHtml = sanitizeHtml(htmlWithoutLead, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "blockquote",
      "pre",
      "code",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "hr",
      "figure",
      "figcaption",
      "img",
      "a",
      "span",
      "sup",
      "sub",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "class"],
      img: [
        "src",
        "alt",
        "title",
        "width",
        "height",
        "loading",
        "srcset",
        "sizes",
        "class",
      ],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    exclusiveFilter: (frame) => {
      if (!normalizedFeatured) return false;
      if (frame.tag !== "img") return false;
      const src = (frame.attribs?.src || "").trim();
      if (!src) return false;

      const normalizedSrc = src.split("?")[0] || src;
      if (normalizedSrc !== normalizedFeatured) return false;

      if (droppedFeaturedFromBody) return false;
      droppedFeaturedFromBody = true;
      return true;
    },
    transformTags: {
      a: (tagName, attribs) => {
        const nextAttribs = { ...attribs };
        const href = (nextAttribs.href || "").trim();

        // Disallow javascript: links even if someone sneaks them in.
        if (/^javascript:/i.test(href)) {
          delete nextAttribs.href;
        }

        // Medium content is external; default to opening in a new tab.
        if (nextAttribs.href && !nextAttribs.target) {
          nextAttribs.target = "_blank";
        }

        // If it's opening a new tab, enforce noopener.
        if (nextAttribs.target === "_blank") {
          const rel = (nextAttribs.rel || "").split(/\s+/).filter(Boolean);
          if (!rel.includes("noopener")) rel.push("noopener");
          if (!rel.includes("noreferrer")) rel.push("noreferrer");
          nextAttribs.rel = rel.join(" ");
        }

        return { tagName, attribs: nextAttribs };
      },
      img: (tagName, attribs) => {
        const nextAttribs = { ...attribs };
        if (!nextAttribs.loading) nextAttribs.loading = "lazy";

        const existing = (nextAttribs.class || "").toString();
        if (!existing.includes("blog-img")) {
          nextAttribs.class = `${existing} blog-img`.trim();
        }

        return { tagName, attribs: nextAttribs };
      },
    },
  });

  const decoratedContentHtml = decorateMediumHtml(sanitizedContentHtml);

  let ai = null;
  try {
    ai = await summarizeTextWithProviderCached({
      cacheKeyParts: [
        "ai-summary",
        "v5",
        "medium",
        article.id,
        article.publishedAt,
      ],
      text:
        `TITLE:\n${article.title}\n\n` +
        (headings.length ? `HEADINGS:\n- ${headings.join("\n- ")}\n\n` : "") +
        `CONTENT:\n${cleanText}`,
      revalidateSeconds: 60 * 60 * 24 * 30,
    });
  } catch {
    ai = null;
  }
  if (process.env.AI_SUMMARY_DEBUG === "1" && ai) {
    console.info(`[ai-summary] provider=${ai.provider} slug=${slug}`);
  }

  const fallbackSynopsis =
    // Prefer the RSS-derived synopsis (already short and usually clean)
    (article.synopsis ? takeFirstSentences(article.synopsis, 2, 420) : "") ||
    // Otherwise derive a short synopsis from extracted text
    takeFirstSentences(cleanText, 2, 420) ||
    // Last resort
    truncate(cleanText, 420);

  const synopsisText = ai?.summary || fallbackSynopsis;

  const base = siteConfig.url.replace(/\/$/, "");
  const canonicalUrl = `${base}/blog/${slug}`;

  const wordCount = fallbackText
    ? fallbackText.split(/\s+/).filter(Boolean).length
    : 0;
  const readTime = estimateReadTimeFromText(fallbackText);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: truncate(cleanText, 240),
    image: featuredImageUrl ? [featuredImageUrl] : undefined,
    datePublished: article.publishedAt,
    keywords: article.categories.join(", "),
    mainEntityOfPage: canonicalUrl,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    isBasedOn: article.link,
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-20">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-sm tracking-wide"
          >
            <ArrowLeft size={16} />
            All Articles
          </Link>
          <div className="flex items-center gap-4">
            <ReadingTimeLeft totalWords={wordCount} />
            <ShareButton title={article.title} url={canonicalUrl} />
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors font-display tracking-wide"
            >
              Read on Medium
              <ArrowUpRight size={14} className="inline ml-1" />
            </a>
          </div>
        </div>
        <ReadingProgress />
      </header>

      <main className="pt-32 pb-24">
        <div className="max-w-[680px] mx-auto px-6 md:px-12 lg:px-24 mb-12">
          <Script
            id="ld-blog-post"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* Categories */}
          {article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-display backdrop-blur-sm capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h1
            className="heading-lg md:text-5xl mb-6 leading-tight"
            style={{ color: "hsl(var(--text-primary))" }}
          >
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar size={14} />
              {formatDate(article.publishedAt)}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock size={14} />
              {readTime}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {wordCount.toLocaleString()} words
            </span>
          </div>

          {/* Synopsis highlight */}
          <div className="border-l-2 border-primary pl-6 py-2 mb-8">
            <p className="body-lg text-base italic">{synopsisText}</p>
          </div>
        </div>

        {/* Featured image */}
        {featuredImageUrl && (
          <div className="max-w-[680px] mx-auto px-6 md:px-12 lg:px-24 mb-12">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/20">
              <Image
                src={featuredImageUrl}
                alt={article.title}
                width={1200}
                height={630}
                priority
                sizes="(max-width: 768px) 100vw, 680px"
                className="w-full h-auto object-contain"
              />
            </div>
            {leadCaptionText ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {leadCaptionText}
              </p>
            ) : null}
          </div>
        )}

        {/* Article content */}
        <article className="max-w-[680px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: decoratedContentHtml }}
            />
            <CodeBlocksEnhancer />
          </div>
        </article>

        {/* Tags at bottom */}
        {article.categories.length > 0 && (
          <div className="max-w-[680px] mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center gap-3">
              <Tag size={14} className="text-muted-foreground" />
              {article.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all font-display capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation between posts */}
        <div className="max-w-[680px] mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-2 gap-6">
            {prevArticle ? (
              <Link
                href={`/blog/${prevArticle.slug}`}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/30 transition-all"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-display">
                  <ChevronLeft size={12} />
                  Previous
                </span>
                <span
                  className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors"
                  style={{ color: "hsl(var(--text-primary))" }}
                >
                  {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextArticle ? (
              <Link
                href={`/blog/${nextArticle.slug}`}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/30 transition-all text-right"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground font-display">
                  Next
                  <ChevronRight size={12} />
                </span>
                <span
                  className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors"
                  style={{ color: "hsl(var(--text-primary))" }}
                >
                  {nextArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-[680px] mx-auto px-6 md:px-12 mt-16">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="label-caps mb-3">Enjoyed this article?</p>
            <h3
              className="heading-md mb-4"
              style={{ color: "hsl(var(--text-primary))" }}
            >
              Read more on <span className="text-gradient-gold">Medium</span>
            </h3>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Read Full Article on Medium
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 lg:px-24 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-display">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm text-primary hover:text-primary/80 transition-colors font-display"
            >
              All Articles
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-display"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
