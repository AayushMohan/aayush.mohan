"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { projects } from "./data/projectsData";

const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="perspective-1000"
    >
      {children}
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="label-caps mb-4"
        >
          Projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="heading-lg mb-16"
          style={{ color: "hsl(var(--text-primary))" }}
        >
          Selected <span className="text-gradient-gold">work</span>
        </motion.h2>

        <div className="flex flex-col gap-20">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <TiltCard>
                  <SpotlightCard
                    className="group overflow-hidden"
                    spotlightColor="hsl(var(--accent) / 0.12)"
                  >
                    <div
                      className="aspect-video overflow-hidden"
                      style={{ direction: "ltr" }}
                    >
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </SpotlightCard>
                </TiltCard>

                <div style={{ direction: "ltr" }}>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="label-caps mb-3"
                  >
                    Case Study {i + 1} of {projects.length}
                  </motion.p>
                  <h3
                    className="heading-md mb-4"
                    style={{ color: "hsl(var(--text-primary))" }}
                  >
                    {project.title}
                  </h3>
                  <p className="body-lg mb-6">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity glow-gold"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary font-display font-medium text-sm transition-all duration-300"
                    >
                      <Github size={16} />
                      Codebase
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
