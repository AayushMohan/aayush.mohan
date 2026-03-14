import type { Metadata } from "next";

import About from "@/components/About";
import Blogs from "@/components/Blogs";
import Contact from "@/components/Contact";
import FloatingParticles from "@/components/FloatingParticles";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.ogImagePath,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.ogImagePath],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <FloatingParticles />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blogs />
      <Contact />
      <Footer />
    </main>
  );
}
