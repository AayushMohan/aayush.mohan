import type { LucideIcon } from "lucide-react";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export type NavLink = {
 label: string;
 href: string;
};

export const navLinks: NavLink[] = [
 { label: "About", href: "#about" },
 { label: "Skills", href: "#skills" },
 { label: "Projects", href: "#projects" },
 { label: "Blog", href: "/blog" },
 { label: "Contact", href: "#contact" },
];

export type SocialLink = {
 icon: LucideIcon;
 href: string;
 label: string;
};

export const navbarSocialLinks: SocialLink[] = [
 { icon: Github, href: "https://github.com/AayushMohan", label: "GitHub" },
 {
  icon: Linkedin,
  href: "https://www.linkedin.com/in/aayushmohan/",
  label: "LinkedIn",
 },
 {
  icon: Twitter,
  href: "https://x.com/AayushMohan",
  label: "Twitter",
 },
 {
  icon: Instagram,
  href: "https://www.instagram.com/aayushmohan/",
  label: "Instagram",
 },
];

// Keep Footer's links as-is (it currently differs from Navbar).
export const footerSocialLinks: SocialLink[] = [
 { icon: Github, href: "https://github.com/AayushMohan", label: "GitHub" },
 {
  icon: Linkedin,
  href: "https://www.linkedin.com/in/aayushmohan/",
  label: "LinkedIn",
 },
 { icon: Twitter, href: "https://twitter.com/aaboroern", label: "Twitter" },
 {
  icon: Instagram,
  href: "https://www.instagram.com/aayushmohan/",
  label: "Instagram",
 },
];
