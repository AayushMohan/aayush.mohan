import Image from "next/image";
import { CardSpotlight } from "./ui/card-spotlight";

const About = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-black px-6 py-12 md:py-20 gap-12 md:gap-24">
      {/* Profile Image - First on both mobile and desktop */}
      <div className="order-1 md:order-1 w-full md:w-[30%] flex justify-center md:justify-start">
        <Image
          src="https://cdn.sanity.io/images/nahptg7w/production/214b077f7a78bf10d1dd8c47afd9748583c60d51-3008x4624.jpg?w=2000&fit=max&auto=format&dpr=2"
          alt="Aayush Mohan"
          width={350}
          height={500}
          className="rounded-2xl object-cover w-48 h-48 md:w-64 md:h-80 xl:w-[350px] xl:h-[500px] shadow-md"
        />
      </div>

      {/* Text Content */}
      <CardSpotlight className="order-2 md:order-2 w-full md:w-[50%] max-w-2xl flex flex-col items-center md:items-start justify-center bg-black/50 p-6 md:p-10 rounded-2xl">
        <p className="text-3xl md:text-4xl font-semibold text-gray-100 pb-2 tracking-[3px] md:tracking-[10px] uppercase z-20">
          About
        </p>
        <div className="text-neutral-200 mt-4 space-y-5 z-20">
          <p className="text-base md:text-lg leading-relaxed">
            Hey, I’m{" "}
            <span className="font-semibold text-white">Aayush Mohan</span> — a
            web developer and AI enthusiast with a passion for building clean,
            high-performing digital experiences.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            From designing sleek user interfaces to engineering robust backends,
            I love turning ideas into interactive, impactful products. Over the
            years, I’ve worked on e-commerce websites, responsive web apps, and
            experimental AI-driven projects, always striving to blend creativity
            with functionality.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Right now, I’m focused on helping businesses elevate their online
            presence through custom web solutions that are fast, modern, and
            user-centric. I believe great design is more than aesthetics — it’s
            about clarity, flow, and purpose.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            If you&apos;re looking for someone who’s obsessed with code quality,
            smooth user experiences, and meaningful results — we might just be a
            great fit.
          </p>
          <p className="text-base md:text-lg font-medium leading-relaxed">
            Let’s build something that stands out.
          </p>
        </div>
      </CardSpotlight>
    </section>
  );
};

export default About;
