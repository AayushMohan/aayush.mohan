"use client";

import Image from "next/image";
import { Spotlight } from "./ui/spotlight-new";
import BackgroundCircles from "./BackgroundCircles";
import { FlipWords } from "./ui/flip-words";
import Link from "next/link";

const Hero = () => {
  const words = [
    "Hey, This is Aayush Mohan",
    "Guy-who-loves-coffee.tsx",
    "<ButLovesToCodeMore />",
  ];

  return (
    <section className="relative min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] overflow-hidden flex flex-col justify-center items-center px-4 py-12">
      <Spotlight />
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
        <BackgroundCircles />

        <Image
          src="https://avatars.githubusercontent.com/u/66319691?v=4"
          priority
          alt="Aayush Mohan"
          className="rounded-full object-cover border-4 border-white/10 shadow-lg"
          width={128}
          height={128}
        />

        <h2 className="text-xs md:text-sm uppercase text-gray-500 tracking-[4px] md:tracking-[8px]">
          Web Developer <span className="text-blue-800 font-black">|</span> ML
          Enthusiast
        </h2>

        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-100 max-w-[90vw] md:max-w-[70vw] px-2">
          <FlipWords words={words} />
        </h1>

        <div className="flex justify-center gap-1 md:gap-4 pt-4 z-20">
          <Link href="#about">
            <button className="heroButton">About</button>
          </Link>
          <Link href="#skills">
            <button className="heroButton">Skills</button>
          </Link>
          <Link href="#projects">
            <button className="heroButton">Projects</button>
          </Link>
          <Link href="#blogs">
            <button className="heroButton">Blogs</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
