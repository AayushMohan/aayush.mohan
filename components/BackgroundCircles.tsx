"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BackgroundCircles = () => {
  const [isHighEndDevice, setIsHighEndDevice] = useState(true);

  useEffect(() => {
    const checkDevicePerformance = () => {
      const hasLowPerformance =
        navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      setIsHighEndDevice(!hasLowPerformance);
    };

    checkDevicePerformance();
    window.addEventListener("resize", checkDevicePerformance);

    return () => window.removeEventListener("resize", checkDevicePerformance);
  }, []);

  const highEndAnimation = {
    initial: { opacity: 0 },
    animate: {
      scale: [1, 2, 2, 3, 1],
      opacity: [0.1, 0.2, 0.4, 0.8, 0.1, 1.0],
      borderRadius: ["20%", "20%", "50%", "80%", "20%"],
    },
    transition: { duration: 2.5 },
  };

  const lowEndAnimation = {
    initial: { opacity: 0 },
    animate: {
      scale: [1, 1.5, 2, 2.5, 1],
      opacity: [0.1, 0.3, 0.5, 0.7, 1.0],
      borderRadius: ["20%", "30%", "40%", "50%", "20%"],
    },
    transition: { duration: 2 },
  };

  return (
    <motion.div
      {...(isHighEndDevice ? highEndAnimation : lowEndAnimation)}
      className="relative flex justify-center items-center"
    >
      <div className="absolute border border-[#333333] rounded-full h-[200px] w-[200px] mt-52 animate-ping" />
      <div className="absolute border border-[#333333] rounded-full h-[300px] w-[300px] mt-52" />
      <div className="absolute border border-[#333333] rounded-full h-[500px] w-[500px] mt-52" />
      <div
        className={`rounded-full border ${
          isHighEndDevice
            ? "border-[#333333] opacity-20 h-[650px] w-[650px]"
            : "border-[#333333] opacity-20 h-[450px] w-[450px]"
        } mt-52 absolute animate-pulse`}
      />
      <div
        className={`rounded-full border border-[#333333] ${
          isHighEndDevice ? "h-[800px] w-[800px]" : "h-[600px] w-[600px]"
        } absolute mt-52`}
      />
    </motion.div>
  );
};

export default BackgroundCircles;
