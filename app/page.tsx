import About from "@/components/About";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <CursorGlow />
      <main>
        <section>
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section>
          <Skills />
        </section>
      </main>
    </div>
  );
}
