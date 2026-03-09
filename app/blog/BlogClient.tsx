"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

import { CardSpotlight } from "@/components/ui/card-spotlight";

type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  link: string;
  publishedAt: string;
  categories: string[];
  imageUrl?: string;
  synopsis: string;
  readTime: string;
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

export default function BlogClient({
  articles,
  initialCategory,
}: {
  articles: BlogListItem[];
  initialCategory: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory,
  );

  useEffect(() => {
    const categoryParam = searchParams?.get("category");
    setSelectedCategory(categoryParam || null);
  }, [searchParams]);

  const allCategories = useMemo(() => {
    return Array.from(new Set(articles.flatMap((a) => a.categories))).filter(
      Boolean,
    );
  }, [articles]);

  const filtered = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((a) => a.categories.includes(selectedCategory));
  }, [articles, selectedCategory]);

  const onSelectCategory = (category: string | null) => {
    const nextCategory = selectedCategory === category ? null : category;
    const nextHref = nextCategory
      ? `/blog?category=${encodeURIComponent(nextCategory)}`
      : "/blog";

    router.push(nextHref, { scroll: false });
  };

  return (
    <>
      {/* Category filter */}
      {allCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 font-display ${
              !selectedCategory
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            }`}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 font-display capitalize ${
                selectedCategory === cat
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      )}

      {/* Blog grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardSpotlight
                color="hsl(var(--primary) / 0.20)"
                className="group p-0 rounded-2xl border border-border bg-card h-full flex flex-col cursor-pointer transition-all duration-500 hover:border-primary/30"
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="h-full flex flex-col"
                >
                  {/* Thumbnail */}
                  {article.imageUrl && (
                    <div className="relative overflow-hidden rounded-t-2xl aspect-[16/10]">
                      <motion.div
                        className="absolute inset-0"
                        animate={{ scale: hoveredIndex === i ? 1.08 : 1 }}
                        transition={{
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                      {/* Category badges */}
                      {article.categories.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                          {article.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-display backdrop-blur-sm capitalize"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>

                    <h2
                      className="heading-md mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
                      style={{ color: "hsl(var(--text-primary))" }}
                    >
                      {article.title}
                    </h2>

                    <p className="body-lg text-sm line-clamp-3 flex-1">
                      {article.synopsis}
                    </p>

                    <span className="inline-flex items-center gap-2 mt-6 text-sm font-display font-semibold text-primary group-hover:text-primary/80 transition-colors">
                      Read Article
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </CardSpotlight>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="body-lg">No articles found in this category.</p>
        </div>
      )}
    </>
  );
}
