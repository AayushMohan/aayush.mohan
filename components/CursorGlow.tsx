"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CursorGlow = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Optimized spring config for smooth performance on low-end devices
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch devices and disable cursor glow effect
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  // Toggle body class to hide native cursor when our custom cursor is visible
  useEffect(() => {
    if (isTouchDevice) return;

    const className = "custom-cursor";
    if (isVisible) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    // cleanup on unmount
    return () => {
      document.body.classList.remove(className);
    };
  }, [isVisible, isTouchDevice]);

  useEffect(() => {
    // Don't run on touch devices for better performance
    if (isTouchDevice) return;

    let rafId: number | null = null;
    let lastX = -100;
    let lastY = -100;

    const moveCursor = (e: MouseEvent) => {
      // throttle with requestAnimationFrame
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        lastX = e.clientX - 16;
        lastY = e.clientY - 16;
        cursorX.set(lastX);
        cursorY.set(lastY);
        setIsVisible(true);
      });
    };

    const hideCursor = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseleave", hideCursor);

    // also hide on mousedown outside (optional)
    window.addEventListener("mousedown", () => setIsVisible(true));
    window.addEventListener("mouseup", () => setIsVisible(true));

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("mousedown", () => setIsVisible(true));
      window.removeEventListener("mouseup", () => setIsVisible(true));
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main Cursor: smaller and lighter */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 0.8 : 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </motion.div>

      {/* Cursor glow: reduce blur for performance */}
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 pointer-events-none z-40 hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 0.08 : 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl" />
      </motion.div>
    </>
  );
};

export default CursorGlow;
