"use client";
import Image from "next/image";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";

const skills = [
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg",
  },
  {
    name: "Redux",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/redux.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tailwindcss.svg",
  },
  {
    name: "GraphQL",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/graphql.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mongodb.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/git.svg",
  },
  {
    name: "Vercel",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vercel.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg",
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg",
  },
  {
    name: "PyTorch",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pytorch.svg",
  },
  {
    name: "Shopify",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg",
  },
  {
    name: "Wix",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wix.svg",
  },
  {
    name: "Figma",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg",
  },
  {
    name: "WebFlow",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/webflow.svg",
  },
];

const Skills = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden bg-black/[0.96] bg-grid-white/[0.02] px-8 py-20">
      <BackgroundRippleEffect />
      <div className="w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-100 md:text-4xl lg:text-7xl">
          Skills
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-500">
          Here are some of the technologies and tools I work with. I focus on
          building scalable, performant web applications using modern frameworks
          and libraries.
        </p>
        <div className="relative z-10 mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-8">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-neutral-100 transition hover:bg-white/10 hover:shadow-lg"
            >
              <Image
                src={skill.icon}
                alt={skill.name + " icon"}
                width={32}
                height={32}
                className="mb-2 opacity-80 invert"
              />
              <span className="text-lg font-medium text-neutral-300">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Skills;
