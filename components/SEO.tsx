import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
  image?: string;
  type?: string;
}

export default function SEO({
  title = "Aayush Mohan - Full-Stack Developer & Machine Learning Enthusiast",
  description = "Passionate full-stack developer, building scalable web applications, mobile solutions, and innovative digital experiences using React, Node.js, Python, and modern technologies.",
  keywords = "Aayush Mohan, Full-Stack Developer, React Developer, Node.js, Python, Web Development, Mobile Development, Software Engineer, Frontend Developer, Backend Developer, JavaScript, TypeScript, AWS, Portfolio",
  author = "Aayush Mohan",
  url = "https://aayushmohan.dev",
  image = "https://aayushmohan.dev/og-image.jpg",
  type = "website",
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Create or update meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("author", author);
    updateMeta("robots", "index, follow");
    updateMeta("viewport", "width=device-width, initial-scale=1.0");

    // Open Graph tags
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", type, true);
    updateMeta("og:url", url, true);
    updateMeta("og:image", image, true);
    updateMeta("og:site_name", "Aayush Mohan Portfolio", true);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
    updateMeta("twitter:creator", "@aayushmohan");

    // Additional SEO tags
    updateMeta("theme-color", "#030213");
    updateMeta("msapplication-TileColor", "#030213");

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Structured data for person
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Aayush Mohan",
      jobTitle: "Full-Stack Developer",
      description: description,
      url: url,
      image: image,
      sameAs: [
        "https://github.com/aayushmohan",
        "https://linkedin.com/in/aayushmohan",
        "https://twitter.com/aayushmohan",
      ],
      knowsAbout: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "Web Development",
        "Mobile Development",
        "Full-Stack Development",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "University of Technology",
      },
      workLocation: {
        "@type": "Place",
        name: "San Francisco, CA",
      },
    };

    // Add or update structured data
    let structuredDataScript = document.querySelector(
      'script[type="application/ld+json"]'
    ) as HTMLScriptElement | null;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement(
        "script"
      ) as HTMLScriptElement;
      structuredDataScript.type = "application/ld+json";
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, author, url, image, type]);

  return null;
}
