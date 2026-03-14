"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Mail, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpotlightCard from "./SpotlightCard";
import { contactCopy, contactLinks } from "./data/contactData";

const ContactGlobe = dynamic(() => import("./ContactGlobe"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 animate-pulse rounded-2xl border border-primary/20 bg-card/40" />
  ),
});

const Contact = () => {
  const globeMountRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadGlobe, setShouldLoadGlobe] = useState(false);

  useEffect(() => {
    const el = globeMountRef.current;
    if (!el || shouldLoadGlobe) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShouldLoadGlobe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadGlobe]);

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-display font-medium text-primary tracking-wide">
                {contactCopy.badge}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-xl mb-6"
              style={{ color: "hsl(var(--text-primary))" }}
            >
              {contactCopy.headingPrefix}{" "}
              <span className="text-gradient-gold">
                {contactCopy.headingEmphasis}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="body-lg mb-12 max-w-lg mx-auto lg:mx-0"
            >
              {contactCopy.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto lg:mx-0"
            >
              <SpotlightCard className="group flex-1">
                <a
                  href={contactLinks.calendly.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-display font-semibold text-foreground">
                      {contactLinks.calendly.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {contactLinks.calendly.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary ml-auto transition-colors"
                  />
                </a>
              </SpotlightCard>

              <SpotlightCard className="group flex-1">
                <a
                  href={contactLinks.email.href}
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-display font-semibold text-foreground">
                      {contactLinks.email.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {contactLinks.email.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary ml-auto transition-colors"
                  />
                </a>
              </SpotlightCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent z-10 pointer-events-none opacity-50" />
            <div ref={globeMountRef} className="absolute inset-0">
              {shouldLoadGlobe ? (
                <ContactGlobe />
              ) : (
                <div className="absolute inset-0 animate-pulse rounded-2xl border border-primary/20 bg-card/40" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
