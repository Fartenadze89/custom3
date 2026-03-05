"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicCup } from "@/components/cinematic/cinematic-cup";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cupState, setCupState] = useState({
    progress: 0,
    section: 0,
    opacity: 1,
    scale: 1,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload fonts
    document.fonts.ready.then(() => {
      setTimeout(() => setIsLoaded(true), 300);
    });

    const sections = gsap.utils.toArray<HTMLElement>(".cin-section");

    // Master scroll timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const sectionIndex = Math.min(
            Math.floor(self.progress * sections.length),
            sections.length - 1
          );
          setCupState({
            progress: self.progress,
            section: sectionIndex,
            opacity: 1,
            scale: 1,
          });
        },
      },
    });

    // Section-specific animations
    sections.forEach((section, i) => {
      const heading = section.querySelector(".cin-heading");
      const subtext = section.querySelector(".cin-subtext");
      const accent = section.querySelector(".cin-accent");

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          if (heading) {
            gsap.fromTo(heading,
              { opacity: 0, y: 80, rotateX: -15 },
              { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: "power3.out" }
            );
          }
          if (subtext) {
            gsap.fromTo(subtext,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
            );
          }
          if (accent) {
            gsap.fromTo(accent,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.8, delay: 0.5, ease: "power2.inOut" }
            );
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Libre+Franklin:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        :root {
          --color-cream: #E5DDD5;
          --color-cream-dark: #D5CCC3;
          --color-brown: #6B4F3A;
          --color-brown-deep: #3D2B1F;
          --color-brown-light: #8B6F5A;
          --color-green: #5A7A3D;
          --color-green-dark: #3D5229;
          --color-kraft: #C4A77D;
          --color-black: #1A1510;

          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Libre Franklin', system-ui, sans-serif;
        }

        html {
          scroll-behavior: auto;
        }

        body {
          font-family: var(--font-body);
          background: var(--color-black);
          color: var(--color-cream);
          overflow-x: hidden;
        }

        .cin-heading {
          font-family: var(--font-display);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -0.03em;
        }

        .cin-heading em {
          font-style: italic;
          font-weight: 400;
        }

        /* Noise texture overlay */
        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Loading Screen */}
      <div
        className={`fixed inset-0 z-[100] bg-[#1A1510] flex items-center justify-center transition-all duration-1000 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#C4A77D]/30 border-t-[#C4A77D] animate-spin" />
          <p className="text-[#8B6F5A] text-sm tracking-[0.3em] uppercase font-light">ecoform</p>
        </div>
      </div>

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Fixed 3D Cup */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <CinematicCup cupState={cupState} />
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="ecoform"
              width={40}
              height={40}
              className="rounded opacity-90"
            />
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm tracking-wide text-[#8B6F5A] hover:text-[#C4A77D] transition-colors">
              Collection
            </a>
            <a href="#" className="text-sm tracking-wide text-[#8B6F5A] hover:text-[#C4A77D] transition-colors">
              Sustainability
            </a>
            <a href="#" className="text-sm tracking-wide text-[#8B6F5A] hover:text-[#C4A77D] transition-colors">
              Pricing
            </a>
            <a
              href="#contact"
              className="text-sm tracking-wide px-6 py-2.5 border border-[#C4A77D]/40 text-[#C4A77D] hover:bg-[#C4A77D] hover:text-[#1A1510] transition-all duration-300"
            >
              Get Quote
            </a>
          </div>
        </div>
      </nav>

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[#3D2B1F]">
        <div
          className="h-full bg-[#C4A77D] origin-left transition-transform duration-100"
          style={{ transform: `scaleX(${cupState.progress})` }}
        />
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="relative z-20">

        {/* Section 1: Opening - Dark & Dramatic */}
        <section className="cin-section min-h-[200vh] relative flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl">
              <div className="cin-accent w-12 h-[2px] bg-[#5A7A3D] mb-8 origin-left" />
              <h1 className="cin-heading text-[12vw] md:text-[10vw] lg:text-[8vw] text-[#E5DDD5] mb-8">
                Crafted<br />
                for <em>tomorrow</em>
              </h1>
              <p className="cin-subtext text-xl md:text-2xl text-[#8B6F5A] font-light max-w-xl leading-relaxed">
                Where sustainable design meets uncompromising quality.
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#6B4F3A]">Scroll</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#6B4F3A] to-transparent animate-pulse" />
          </div>
        </section>

        {/* Section 2: The Reveal */}
        <section className="cin-section min-h-[200vh] relative flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <span className="cin-accent inline-block w-8 h-[1px] bg-[#5A7A3D] mb-6" />
                <h2 className="cin-heading text-[8vw] md:text-[6vw] lg:text-[4vw] text-[#E5DDD5] mb-8">
                  Every detail,<br />
                  <em>intentional</em>
                </h2>
                <p className="cin-subtext text-lg text-[#8B6F5A] font-light leading-relaxed max-w-md">
                  Our double-wall construction isn't just about insulation—it's a commitment
                  to craftsmanship. Each cup is engineered to feel substantial in your hands
                  while treading lightly on the earth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Sizes */}
        <section className="cin-section min-h-[200vh] relative flex items-center bg-gradient-to-b from-transparent via-[#1A1510] to-[#0D0A07]">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="text-center max-w-5xl mx-auto">
              <h2 className="cin-heading text-[10vw] md:text-[8vw] lg:text-[6vw] text-[#E5DDD5] mb-16">
                Three sizes,<br />
                <em>infinite possibilities</em>
              </h2>

              <div className="cin-subtext grid md:grid-cols-3 gap-8 md:gap-4 mt-20">
                {[
                  { size: "4oz", name: "Espresso", desc: "Bold shots, refined moments" },
                  { size: "8oz", name: "Classic", desc: "The perfect everyday" },
                  { size: "12oz", name: "Grande", desc: "For those who need more" },
                ].map((cup, i) => (
                  <div
                    key={cup.size}
                    className="group p-8 border border-[#3D2B1F] hover:border-[#5A7A3D] transition-colors duration-500"
                  >
                    <span className="block text-[#5A7A3D] text-xs tracking-[0.3em] uppercase mb-4">
                      {cup.size}
                    </span>
                    <h3 className="font-display text-3xl text-[#E5DDD5] mb-3">{cup.name}</h3>
                    <p className="text-sm text-[#6B4F3A] font-light">{cup.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Materials */}
        <section className="cin-section min-h-[200vh] relative flex items-center bg-[#0D0A07]">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-[#5A7A3D] text-xs tracking-[0.3em] uppercase mb-6 block">Materials</span>
                <h2 className="cin-heading text-[8vw] md:text-[5vw] lg:text-[3.5vw] text-[#E5DDD5] mb-10">
                  Pure craft,<br />
                  <em>honest materials</em>
                </h2>
                <div className="cin-subtext space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-full bg-[#C4A77D] flex-shrink-0" />
                    <div>
                      <h4 className="text-[#E5DDD5] font-medium mb-2">Natural Kraft</h4>
                      <p className="text-[#6B4F3A] text-sm font-light leading-relaxed">
                        Unbleached paper that shows its true character.
                        Warm, organic, unmistakably sustainable.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-full bg-[#F5F1ED] flex-shrink-0" />
                    <div>
                      <h4 className="text-[#E5DDD5] font-medium mb-2">Clean White</h4>
                      <p className="text-[#6B4F3A] text-sm font-light leading-relaxed">
                        For brands that speak in minimalism.
                        The perfect canvas for your story.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section id="contact" className="cin-section min-h-screen relative flex items-center bg-gradient-to-b from-[#0D0A07] to-[#1A1510]">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="cin-heading text-[10vw] md:text-[7vw] lg:text-[5vw] text-[#E5DDD5] mb-10">
                Ready to<br />
                <em>make the switch?</em>
              </h2>
              <p className="cin-subtext text-xl text-[#8B6F5A] font-light mb-16 max-w-xl mx-auto">
                Join 500+ businesses across Georgia who chose sustainability without compromise.
              </p>

              <div className="cin-subtext flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="px-12 py-5 bg-[#5A7A3D] text-[#E5DDD5] text-sm tracking-wide hover:bg-[#6B8A4D] transition-colors"
                >
                  Request Samples
                </a>
                <a
                  href="#"
                  className="px-12 py-5 border border-[#C4A77D]/50 text-[#C4A77D] text-sm tracking-wide hover:bg-[#C4A77D] hover:text-[#1A1510] transition-all"
                >
                  Get Custom Quote
                </a>
              </div>

              {/* Stats */}
              <div className="mt-24 pt-16 border-t border-[#3D2B1F] grid grid-cols-3 gap-8">
                {[
                  { value: "100%", label: "Recyclable" },
                  { value: "500+", label: "Clients" },
                  { value: "3M+", label: "Cups Delivered" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="block text-4xl md:text-5xl font-display text-[#C4A77D]">{stat.value}</span>
                    <span className="text-xs tracking-[0.2em] uppercase text-[#6B4F3A] mt-2 block">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-[#3D2B1F] bg-[#1A1510]">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Image src="/logo.jpeg" alt="ecoform" width={32} height={32} className="rounded opacity-70" />
                <span className="text-[#6B4F3A] text-sm">© 2024 ecoform</span>
              </div>
              <div className="flex gap-8 text-xs tracking-wide text-[#6B4F3A]">
                <a href="#" className="hover:text-[#C4A77D] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#C4A77D] transition-colors">Terms</a>
                <a href="#" className="hover:text-[#C4A77D] transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
