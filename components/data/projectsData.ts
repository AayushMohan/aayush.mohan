export type Project = {
 title: string;
 description: string;
 tags: string[];
 image: string;
 live: string;
 code: string;
};

export const projects: Project[] = [
 {
  title: "The News App",
  description:
   "Mobile-optimized web app for browsing and filtering news from multiple sources, with a clean, performant UI and robust search/filtering.",
  tags: ["Next.js", "TypeScript", "Tailwind", "GraphQL"],
  image: "/assets/project-news.png",
  live: "https://news-app-sigma-khaki.vercel.app/",
  code: "https://github.com/AayushMohan/news-app",
 },
 {
  title: "OpenSea Clone",
  description:
   "Explore blockchain assets and NFTs with a clean, responsive UI and smooth interactions.",
  tags: ["Next.js", "React", "Tailwind", "Sanity"],
  image: "/assets/project-opensea.png",
  live: "https://opensea-blockchain-clone-psi.vercel.app/",
  code: "https://github.com/AayushMohan/opensea-blockchain-clone",
 },
 {
  title: "Natours Project",
  description:
   "Travel agency landing page focused on elegant CSS/SCSS animations and accessible layout.",
  tags: ["HTML", "CSS", "SCSS"],
  image: "/assets/project-natours.png",
  live: "https://aayushmohan.github.io/Natours-Project/",
  code: "https://github.com/AayushMohan/Natours-Project",
 },
];
