export type MediumArticle = {
 id: string;
 slug: string;
 title: string;
 link: string;
 publishedAt: string;
 categories: string[];
 imageUrl?: string;
 synopsis: string;
 contentHtml?: string;
};

const FEED_BASE = "https://medium.com/feed";

function decodeBasicEntities(input: string): string {
 return input
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'");
}

function stripHtml(html: string): string {
 const withoutFigcaptions = html.replace(/<figcaption>[\s\S]*?<\/figcaption>/gi, " ");
 const withoutTags = withoutFigcaptions.replace(/<[^>]+>/g, " ");
 const decoded = decodeBasicEntities(withoutTags);
 return decoded.replace(/\s+/g, " ").trim();
}

function getTagValue(block: string, tagName: string): string {
 const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
 const match = block.match(re);
 if (!match) return "";

 const raw = match[1] ?? "";
 const cdataMatch = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
 return (cdataMatch ? cdataMatch[1] : raw).trim();
}

function pickFirstImageUrl(html: string): string | undefined {
 const imgRe = /<img[^>]+src="([^"]+)"/gi;
 for (const match of html.matchAll(imgRe)) {
  const src = (match[1] || "").trim();
  if (!src) continue;
  // Skip Medium tracking pixels
  if (src.includes("medium.com/_/stat")) continue;
  return src;
 }
 return undefined;
}

function truncate(text: string, maxLen: number): string {
 if (text.length <= maxLen) return text;
 const sliced = text.slice(0, maxLen);
 const lastSpace = sliced.lastIndexOf(" ");
 return (lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced).trimEnd() + "…";
}

function extractSynopsisFromHtml(html: string): string {
 // Remove figures (hero image + captions) and code blocks.
 const withoutFigures = html.replace(/<figure>[\s\S]*?<\/figure>/gi, " ");
 const withoutPre = withoutFigures.replace(/<pre>[\s\S]*?<\/pre>/gi, " ");

 const paragraphs = Array.from(
  withoutPre.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi),
 ).map((m) => stripHtml(m[1] ?? "").trim());

 const picked: string[] = [];
 for (const p of paragraphs) {
  if (!p) continue;
  if (p.length < 40) continue;
  if (p.toLowerCase() === "introduction:" || p.toLowerCase() === "introduction") continue;
  picked.push(p);
  if (picked.length >= 3) break;
 }

 const combined = picked.join(" ");
 const fallback = stripHtml(withoutPre);
 return truncate(combined || fallback, 280);
}

function toSlugFromLink(link: string): string {
 try {
  const url = new URL(link);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
 } catch {
  const parts = link.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
 }
}

export async function getMediumArticles(handle: string): Promise<MediumArticle[]> {
 const { unstable_cache } = await import("next/cache");

 const fetchAndParse = async (): Promise<MediumArticle[]> => {
  const url = `${FEED_BASE}/@${handle}`;
  const res = await fetch(url, {
   headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
   },
   // Keep it fresh-ish but cacheable for SEO.
   next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
   throw new Error(`Failed to fetch Medium RSS feed (${res.status})`);
  }

  const xml = await res.text();
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).map(
   (m) => m[1] ?? "",
  );

  const articles: MediumArticle[] = [];

  for (const item of items) {
   const guid = getTagValue(item, "guid");
   const idMatch = guid.match(/medium\.com\/p\/([0-9a-f]+)$/i);
   const id = idMatch?.[1] ?? "";

   const title = stripHtml(getTagValue(item, "title"));
   const link = getTagValue(item, "link").split("?")[0] || "";
   const slug = toSlugFromLink(link);
   const publishedAt = getTagValue(item, "pubDate");

   const categories = Array.from(
    item.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi),
   )
    .map((m) => {
     const raw = (m[1] ?? "").trim();
     const cdataMatch = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
     return stripHtml((cdataMatch ? cdataMatch[1] : raw).trim());
    })
    .filter(Boolean);

   const contentEncoded = getTagValue(item, "content:encoded");
   const description = getTagValue(item, "description");

   const imageUrl = pickFirstImageUrl(contentEncoded || description);

   const synopsisSource = contentEncoded || description;
   const synopsis = extractSynopsisFromHtml(synopsisSource);

   if (!title || !link || !slug) continue;

   articles.push({
    id: id || link,
    slug,
    title,
    link,
    publishedAt,
    categories,
    imageUrl,
    synopsis,
    contentHtml: contentEncoded || description || undefined,
   });
  }

  return articles;
 };

 const cached = unstable_cache(fetchAndParse, ["medium-rss", handle], {
  revalidate: 60 * 60,
 });

 return cached();
}

export async function getMediumArticleBySlug(
 handle: string,
 slug: string,
): Promise<MediumArticle | null> {
 const articles = await getMediumArticles(handle);
 return articles.find((a) => a.slug === slug) ?? null;
}
