"use client";

import { useEffect, useMemo, useState } from "react";
import { useScroll } from "framer-motion";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function ReadingTimeLeft({
  totalWords,
  wpm = 220,
}: {
  totalWords: number;
  wpm?: number;
}) {
  const { scrollYProgress } = useScroll();
  const totalMinutes = useMemo(() => {
    const minutes = Math.max(1, Math.round(totalWords / wpm));
    return minutes;
  }, [totalWords, wpm]);

  const [minutesLeft, setMinutesLeft] = useState(totalMinutes);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const progress = clamp(v ?? 0, 0, 1);
      const left = Math.ceil(totalMinutes * (1 - progress));
      setMinutesLeft(clamp(left, 0, totalMinutes));
    });
    return () => unsub();
  }, [scrollYProgress, totalMinutes]);

  if (!Number.isFinite(totalWords) || totalWords <= 0) return null;

  return (
    <span className="text-xs text-muted-foreground font-display tracking-wide">
      {minutesLeft} min left
    </span>
  );
}
