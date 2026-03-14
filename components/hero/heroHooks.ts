import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export function useTypingText(word: string, speedMs: number) {
 const [displayText, setDisplayText] = useState("");

 useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (displayText !== word) {
   timeoutId = setTimeout(() => {
    setDisplayText(word.slice(0, displayText.length + 1));
   }, speedMs);
  }

  return () => {
   if (timeoutId) clearTimeout(timeoutId);
  };
 }, [displayText, speedMs, word]);

 return displayText;
}

export function useBlinkingCursor(intervalMs: number) {
 const [showCursor, setShowCursor] = useState(true);

 useEffect(() => {
  const intervalId = setInterval(() => setShowCursor((p) => !p), intervalMs);
  return () => clearInterval(intervalId);
 }, [intervalMs]);

 return showCursor;
}

export function useHeroParallax(sectionRef: RefObject<HTMLElement | null>) {
 const mouseX = useMotionValue(0);
 const mouseY = useMotionValue(0);
 const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
 const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

 const particlesX = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
 const particlesY = useTransform(smoothY, [-0.5, 0.5], [-25, 25]);
 const glowX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
 const glowY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

 useEffect(() => {
  const el = sectionRef.current;
  if (!el) return;

  const handleMouseMove = (e: MouseEvent) => {
   const rect = el.getBoundingClientRect();
   mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
   mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  el.addEventListener("mousemove", handleMouseMove);
  return () => el.removeEventListener("mousemove", handleMouseMove);
 }, [mouseX, mouseY, sectionRef]);

 return { particlesX, particlesY, glowX, glowY };
}
