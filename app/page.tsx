import About from "@/components/About";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div>
      <section className="h-screen">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
    </div>
  );
}
