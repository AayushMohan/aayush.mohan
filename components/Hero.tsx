"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MagneticButton from "./MagneticButton";
import {
  getHeroRingBorderColor,
  heroCopy,
  heroName,
  heroProfileImage,
  heroRings,
  heroTyping,
} from "./data/heroData";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = heroName;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (displayText !== currentWord) {
      timeoutId = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }, heroTyping.speedMs);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [displayText]);

  useEffect(() => {
    const interval = setInterval(
      () => setShowCursor((p) => !p),
      heroTyping.cursorBlinkMs,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center section-padding overflow-hidden">
      {/* Concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {heroRings.indices.map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2 + i * 0.15,
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute rounded-full border"
            style={{
              width: `${heroRings.baseSizePx + i * heroRings.stepPx}px`,
              height: `${heroRings.baseSizePx + i * heroRings.stepPx}px`,
              borderColor: getHeroRingBorderColor(i),
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(42 78% 55% / 0.12), transparent 70%)",
        }}
      />

      {/* Profile image */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-8"
      >
        <div className="relative">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-4 ring-offset-background">
            <Image
              src={heroProfileImage.src}
              alt={heroProfileImage.alt}
              width={heroProfileImage.width}
              height={heroProfileImage.height}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="label-caps mb-6 relative z-10"
      >
        {heroCopy.rolesLabel}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="heading-xl text-center relative z-10"
        style={{ color: "hsl(var(--text-primary))" }}
      >
        Hey, I&apos;m{" "}
        <span className="text-gradient-gold">
          {displayText}
          <span
            className="inline-block w-[3px] h-[0.8em] bg-primary ml-1 align-middle"
            style={{ opacity: showCursor ? 1 : 0 }}
          />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="body-lg text-center max-w-lg mt-6 relative z-10"
      >
        {heroCopy.introLine}
      </motion.p>

      {/* CTA Buttons with magnetic effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex gap-4 mt-10 relative z-10"
      >
        <MagneticButton
          as="a"
          href="#projects"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity glow-gold"
        >
          {heroCopy.ctaPrimary}
        </MagneticButton>
        <MagneticButton
          as="a"
          href="#contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-foreground font-display font-medium text-sm tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
        >
          {heroCopy.ctaSecondary}
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
