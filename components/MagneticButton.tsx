"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type MagneticButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
};

type MagneticAnchorProps = MagneticButtonBaseProps & {
  as: "a";
} & Omit<
    HTMLMotionProps<"a">,
    "as" | "children" | "className" | "animate" | "transition"
  >;

type MagneticButtonElementProps = MagneticButtonBaseProps & {
  as?: "button";
} & Omit<
    HTMLMotionProps<"button">,
    "as" | "children" | "className" | "animate" | "transition"
  >;

type MagneticButtonProps = MagneticAnchorProps | MagneticButtonElementProps;

const MagneticButton = ({
  children,
  className = "",
  as = "button",
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {as === "a" ? (
        <motion.a
          {...(props as Omit<
            MagneticAnchorProps,
            keyof MagneticButtonBaseProps | "as"
          >)}
          animate={{ x: position.x, y: position.y }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            mass: 0.1,
          }}
          className={className}
        >
          {children}
        </motion.a>
      ) : (
        <motion.button
          {...(props as Omit<
            MagneticButtonElementProps,
            keyof MagneticButtonBaseProps | "as"
          >)}
          animate={{ x: position.x, y: position.y }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            mass: 0.1,
          }}
          className={className}
        >
          {children}
        </motion.button>
      )}
    </div>
  );
};

export default MagneticButton;
