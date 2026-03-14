"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import { blogs } from "./data/blogsData";

const Blogs = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="blogs" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="label-caps mb-4"
        >
          Blog
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="heading-lg mb-16"
          style={{ color: "hsl(var(--text-primary))" }}
        >
          Latest <span className="text-gradient-gold">thoughts</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
            >
              <SpotlightCard className="group h-full flex flex-col cursor-pointer transition-all duration-500 hover:border-primary/30">
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-2xl aspect-[16/10]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-display backdrop-blur-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 flex flex-col p-6"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === i ? null : i)
                  }
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {blog.date}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3
                    className="heading-md mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
                    style={{ color: "hsl(var(--text-primary))" }}
                  >
                    {blog.title}
                  </h3>
                  <p className="body-lg text-sm line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="body-lg text-sm mt-4 pt-4 border-t border-border">
                          {blog.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div whileHover={{ x: 4 }} className="mt-6">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-display font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read synopsis
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </Link>
                  </motion.div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors font-display tracking-wide"
          >
            View all posts
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Blogs;
