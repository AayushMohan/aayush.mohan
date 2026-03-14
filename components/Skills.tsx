"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import { skillCategories } from "./data/skillsData";

export default function Skills() {
  return (
    <section id="skills" className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="label-caps mb-4"
        >
          Skills
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="heading-lg mb-16"
          style={{ color: "hsl(var(--text-primary))" }}
        >
          Technologies I <span className="text-gradient-gold">work with</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.15, duration: 0.7 }}
            >
              <SpotlightCard className="p-6 md:p-8 h-full group">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: categoryIndex * 0.3,
                    }}
                  />
                  <h3 className="text-sm font-display font-semibold text-primary tracking-wide uppercase">
                    {category.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  {category.description}
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {category.skills.map(({ name, icon }, skillIndex) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        duration: 0.4,
                      }}
                      whileHover={{ y: -6, scale: 1.1 }}
                      className="group/skill flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center group-hover/skill:border-primary/40 group-hover/skill:bg-primary/5 group-hover/skill:shadow-[0_0_20px_-5px_hsl(var(--accent)/0.2)] transition-all duration-300">
                        <img
                          src={icon}
                          alt={name}
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground group-hover/skill:text-foreground transition-colors font-medium text-center leading-tight">
                        {name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
