"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Leaf, Layers, Users, Recycle, TreePine, Award } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Eco-First",
    description: "100% recyclable materials sourced responsibly",
    stat: "100%",
    statLabel: "Recyclable",
  },
  {
    icon: Layers,
    title: "Premium Quality",
    description: "Double-wall insulation for superior warmth",
    stat: "2x",
    statLabel: "Insulation",
  },
  {
    icon: Users,
    title: "Local Support",
    description: "Georgian business, fast and personal service",
    stat: "500+",
    statLabel: "Clients",
  },
];

const milestones = [
  { icon: Recycle, label: "Cups Produced", value: "2M+", color: "text-green" },
  { icon: TreePine, label: "Trees Saved", value: "850+", color: "text-green-light" },
  { icon: Award, label: "Years Active", value: "5+", color: "text-kraft" },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" className="relative py-32 bg-cream overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #6B4F3A 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Decorative elements */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[5%] w-80 h-80 border border-green/10 rounded-full" />
        <div className="absolute top-32 right-[8%] w-60 h-60 border border-kraft/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-green/5 rounded-full blur-[100px]" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        {/* Top — editorial header spanning full width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-green bg-green/8 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            Our Story
          </span>
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.75rem] font-light text-brown-dark leading-[1.1]">
              Crafted with
              <br />
              <em className="text-green font-light italic">purpose & care</em>
            </h2>
            <div className="max-w-lg lg:ml-auto">
              <p className="text-lg text-brown leading-relaxed mb-4">
                At ecoform, we believe that everyday choices can make an
                extraordinary difference. Every cup we create is a step toward a
                more sustainable future.
              </p>
              <p className="text-brown-light leading-relaxed">
                Our cups are made from responsibly sourced paper, designed to
                decompose naturally while providing the premium feel your customers
                deserve. We partner with cafes, restaurants, and businesses across
                Georgia who share our vision.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Impact stats — full-width banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] bg-brown-dark overflow-hidden mb-20"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark to-brown opacity-90" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-green/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />

          <div className="relative grid grid-cols-3 divide-x divide-white/10">
            {milestones.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                className="py-10 px-6 text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <m.icon size={22} className={`${m.color} transition-transform duration-300 group-hover:scale-110`} />
                </div>
                <span className={`block font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-light ${m.color} mb-1`}>
                  {m.value}
                </span>
                <span className="text-xs uppercase tracking-widest text-cream-dark/50">
                  {m.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values — overlapping cards with depth */}
        <div className="grid md:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.6 + i * 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="group relative"
            >
              <div className="relative bg-white rounded-[1.5rem] p-8 hover:shadow-2xl hover:shadow-brown/10 hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                {/* Corner decoration */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-green/5 rounded-full transition-transform duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-green/10 mb-5 flex items-center justify-center group-hover:bg-green/15 transition-colors duration-300">
                    <v.icon size={24} className="text-green" />
                  </div>

                  <h4 className="font-[family-name:var(--font-display)] text-xl mb-2 text-brown-dark">
                    {v.title}
                  </h4>
                  <p className="text-sm text-brown-light leading-relaxed mb-6">
                    {v.description}
                  </p>

                  {/* Mini stat */}
                  <div className="pt-5 border-t border-cream-dark/30">
                    <span className="font-[family-name:var(--font-display)] text-3xl font-medium text-green">
                      {v.stat}
                    </span>
                    <span className="block text-[10px] uppercase tracking-widest text-brown-light mt-1">
                      {v.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
