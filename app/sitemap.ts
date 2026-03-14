import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getMediumArticles } from "@/lib/medium";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const base = siteConfig.url.replace(/\/$/, "");

 let articles: Awaited<ReturnType<typeof getMediumArticles>> = [];
 try {
  articles = await getMediumArticles("aayushmohan");
 } catch {
  // If Medium is temporarily unavailable, still serve a valid sitemap.
  articles = [];
 }

 const blogPosts: MetadataRoute.Sitemap = articles.map((a) => ({
  url: `${base}/blog/${a.slug}`,
  lastModified: new Date(a.publishedAt),
  changeFrequency: "monthly",
  priority: 0.7,
 }));

 return [
  {
   url: `${base}/`,
   lastModified: new Date(),
   changeFrequency: "weekly",
   priority: 1,
  },
  {
   url: `${base}/blog`,
   lastModified: new Date(),
   changeFrequency: "weekly",
   priority: 0.8,
  },
  ...blogPosts,
 ];
}
