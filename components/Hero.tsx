"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import MagneticButton from "./MagneticButton";
import { useBlinkingCursor, useTypingText } from "./hero/heroHooks";
import {
  getBaseRingBorderColor,
  getOrbitDotStyle,
  getRingMask,
  getRingSizePx,
} from "./hero/heroRings";
import {
  getHeroRingBorderColor,
  heroCopy,
  heroName,
  heroProfileImage,
  heroRings,
  heroTyping,
} from "./data/heroData";

const Hero = () => {
  const displayText = useTypingText(heroName, heroTyping.speedMs);
  const showCursor = useBlinkingCursor(heroTyping.cursorBlinkMs);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center section-padding overflow-hidden"
    >
      {/* Concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
        {heroRings.indices.map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0, rotate: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: i % 2 === 0 ? 360 : -360,
            }}
            transition={{
              scale: {
                delay: 0.2 + i * 0.15,
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { delay: 0.2 + i * 0.15, duration: 1.5 },
              rotate: {
                duration: 30 + i * 10,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className="absolute rounded-full"
            style={{
              width: getRingSizePx(i, heroRings.baseSizePx, heroRings.stepPx),
              height: getRingSizePx(i, heroRings.baseSizePx, heroRings.stepPx),
            }}
          >
            <div
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: getBaseRingBorderColor(i),
              }}
            />

            <div
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: getHeroRingBorderColor(i),
                maskImage: getRingMask(i),
                WebkitMaskImage: getRingMask(i),
              }}
            />

            {/* Orbiting dot */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={getOrbitDotStyle(i)}
            />
          </motion.div>
        ))}
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-15 pointer-events-none z-[1]"
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.12), transparent 70%)",
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
              className="w-full h-full object-cover object-[50%_12%] scale-[1.12] origin-top"
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
