import type { Metadata } from "next";
import Link from "next/link";

import FloatingParticles from "@/components/FloatingParticles";
import { siteConfig } from "@/lib/site";
import { getMediumArticles } from "@/lib/medium";
import BlogClient from "./BlogClient";

import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "All writing by Aayush Mohan — practical notes on full-stack engineering, AI/ML, and building products.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "All writing by Aayush Mohan — practical notes on full-stack engineering, AI/ML, and building products.",
    url: "/blog",
    type: "website",
  },
};

function estimateReadTimeFromHtml(html: string | undefined): string {
  if (!html) return "1 min read";
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const articles = await getMediumArticles("aayushmohan");

  const resolvedSearchParams = await searchParams;

  const initialCategory =
    typeof resolvedSearchParams?.category === "string"
      ? resolvedSearchParams.category
      : null;

  const listItems = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    link: a.link,
    publishedAt: a.publishedAt,
    categories: a.categories,
    imageUrl: a.imageUrl,
    synopsis: a.synopsis,
    readTime: estimateReadTimeFromHtml(a.contentHtml),
  }));

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />

      {/* SEO-optimized header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-sm tracking-wide"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <a
            href="https://medium.com/@aayushmohan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors font-display tracking-wide"
          >
            Follow on Medium
            <ArrowUpRight size={14} className="inline ml-1" />
          </a>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero section for blog */}
          <div className="mb-16">
            <p className="label-caps mb-4">Aayush Mohan&apos;s Blog</p>
            <h1
              className="heading-xl mb-6"
              style={{ color: "hsl(var(--text-primary))" }}
            >
              Thoughts on{" "}
              <span className="text-gradient-gold">AI & Engineering</span>
            </h1>
            <p className="body-lg max-w-2xl">
              Deep dives into machine learning, AI architectures, and building
              production-grade systems. Written by Aayush Mohan — software
              engineer & AI practitioner.
            </p>
          </div>

          <BlogClient articles={listItems} initialCategory={initialCategory} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 lg:px-24 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-display">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-display"
          >
            Back to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
