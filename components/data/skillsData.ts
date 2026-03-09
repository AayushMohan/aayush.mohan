export type Skill = {
 name: string;
 icon: string;
};

export type SkillCategory = {
 title: string;
 description: string;
 skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
 {
  title: "Frontend",
  description: "Crafting pixel-perfect interfaces",
  skills: [
   {
    name: "HTML",
    icon: "https://img.icons8.com/color/48/null/html-5--v1.png",
   },
   { name: "CSS", icon: "https://img.icons8.com/color/48/null/css3.png" },
   { name: "Sass", icon: "https://img.icons8.com/color/48/null/sass.png" },
   {
    name: "Tailwind",
    icon: "https://img.icons8.com/color/48/null/tailwind_css.png",
   },
   {
    name: "JavaScript",
    icon: "https://img.icons8.com/color/48/null/javascript--v1.png",
   },
   {
    name: "TypeScript",
    icon: "https://img.icons8.com/color/48/null/typescript.png",
   },
   {
    name: "React",
    icon: "https://img.icons8.com/plasticine/100/null/react.png",
   },
   { name: "Next.js", icon: "https://img.icons8.com/fluency/48/nextjs.png" },
  ],
 },
 {
  title: "Backend & Tools",
  description: "Building robust systems",
  skills: [
   {
    name: "Node.js",
    icon: "https://img.icons8.com/color/48/null/nodejs.png",
   },
   {
    name: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
   },
   {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
   },
   {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
   },
   {
    name: "Prisma",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
   },
   {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
   },
   {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
   },
   {
    name: "Firebase",
    icon: "https://img.icons8.com/color/48/null/firebase.png",
   },
  ],
 },
 {
  title: "AI / ML",
  description: "Intelligent solutions",
  skills: [
   {
    name: "Python",
    icon: "https://img.icons8.com/color/48/null/python--v1.png",
   },
   {
    name: "Jupyter",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
   },
   {
    name: "PyTorch",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
   },
   {
    name: "TensorFlow",
    icon: "https://img.icons8.com/color/48/tensorflow.png",
   },
   { name: "NumPy", icon: "https://img.icons8.com/color/48/numpy.png" },
   { name: "Pandas", icon: "https://img.icons8.com/color/48/pandas.png" },
   {
    name: "scikit-learn",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
   },
   {
    name: "OpenCV",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
   },
  ],
 },
];
