"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { aboutCopy, aboutHeading, aboutImage } from "./data/aboutData";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" className="section-padding" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <motion.p {...fadeUp} className="label-caps mb-4">
          About
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[240px] sm:max-w-sm mx-auto md:mx-0"
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <Image
                alt={aboutImage.alt}
                src={aboutImage.src}
                fill
                priority
                className="object-cover"
                sizes={aboutImage.sizes}
              />
            </motion.div>
            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-primary/20 -z-10" />
            <motion.div
              className="absolute -top-3 -left-3 w-full h-full rounded-2xl border border-primary/10 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            />
          </motion.div>

          <div>
            <motion.h2
              {...fadeUp}
              className="heading-lg mb-8"
              style={{ color: "hsl(var(--text-primary))" }}
            >
              {aboutHeading.titleTop}
              <br />
              <span className="text-gradient-gold">
                {aboutHeading.titleBottom}
              </span>
            </motion.h2>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="body-lg mb-6"
            >
              {aboutCopy.primary}
            </motion.p>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="body-lg"
            >
              {aboutCopy.secondary}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
