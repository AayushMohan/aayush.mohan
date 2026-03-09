"use client";

import { motion, useScroll } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-border overflow-hidden">
      <motion.div
        className="h-full bg-primary origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
