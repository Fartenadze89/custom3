"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CUPS } from "./cup-scene";

const CupSceneFullscreen = dynamic(
  () => import("./cup-scene").then((m) => ({ default: m.CupSceneFullscreen })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-kraft border-t-green animate-spin" />
      </div>
    ),
  }
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(1);

  const onNext = useCallback(
    () => setActiveIndex((i) => (i + 1) % CUPS.length),
    []
  );
  const onPrev = useCallback(
    () => setActiveIndex((i) => (i - 1 + CUPS.length) % CUPS.length),
    []
  );

  const activeCup = CUPS[activeIndex];

  return (
    <section className="relative min-h-screen">
      {/* Soft blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 right-[10%] w-[500px] h-[500px] rounded-full bg-kraft opacity-25 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 30, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
          className="absolute bottom-0 -left-20 w-[350px] h-[350px] rounded-full bg-green opacity-10 blur-[100px]"
        />
      </div>

      {/* 3D CANVAS — absolute, fills entire section, z-index 1 */}
      <CupSceneFullscreen
        activeIndex={activeIndex}
        onNext={onNext}
        onPrev={onPrev}
      />

      {/* TEXT — z-index 2, pointer-events-none except on interactive elements */}
      <div
        className="relative min-h-screen flex items-center pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 w-full">
          <div className="max-w-lg">
            <motion.div initial="hidden" animate="visible">
              <motion.div variants={fadeUp} custom={0} className="mb-6 pointer-events-auto">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-green px-4 py-2 rounded-full border border-green/20">
                  <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                  Sustainable by Design
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.25rem] font-light text-brown-dark leading-[1.08] mb-6"
              >
                Cups that care
                <br />
                for <em className="text-green font-light italic">tomorrow</em>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-base lg:text-lg text-brown-light max-w-md mb-10 leading-relaxed"
              >
                Premium eco-friendly paper cups crafted for businesses that value
                sustainability without compromising quality.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mb-14 pointer-events-auto">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-green text-white hover:bg-green-dark px-8 shadow-lg shadow-green/25 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <a href="#products">Explore Products</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-brown text-brown hover:bg-brown hover:text-cream px-8 transition-all duration-300"
                >
                  <a href="#contact">Request Sample</a>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="flex gap-10 lg:gap-12 pt-8 border-t border-cream-dark/40">
                {[
                  { num: "100%", label: "Recyclable" },
                  { num: "3", label: "Cup Sizes" },
                  { num: "500+", label: "Happy Clients" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl font-medium text-brown">
                      {stat.num}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest text-brown-light mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CAROUSEL CONTROLS — z-index 3, bottom-right */}
      <div
        className="absolute bottom-24 right-8 sm:right-12 lg:right-16 flex flex-col items-center gap-3 pointer-events-auto"
        style={{ zIndex: 3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCup.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-display)] text-lg text-brown-dark leading-tight">
              {activeCup.label}
            </p>
            <p className="text-sm text-brown-light">{activeCup.sub}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            aria-label="Previous cup"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-md border border-cream-dark/40 flex items-center justify-center text-brown hover:bg-white hover:scale-110 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {CUPS.map((cup, i) => (
              <button
                key={cup.id}
                aria-label={`Show ${cup.label}`}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex ? "w-7 bg-green" : "w-1.5 bg-brown/20 hover:bg-brown/35"
                }`}
              />
            ))}
          </div>
          <button
            onClick={onNext}
            aria-label="Next cup"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-md border border-cream-dark/40 flex items-center justify-center text-brown hover:bg-white hover:scale-110 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <p className="text-[10px] text-brown-light/40 tracking-widest uppercase">
          Drag or use arrows
        </p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 3 }}
      >
        <motion.div
          animate={{ scaleY: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-brown to-transparent"
        />
        <span className="text-[10px] uppercase tracking-[0.15em] text-brown-light/60 flex items-center gap-1">
          <ArrowDown size={10} />
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
