"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";

/* ─── Animated Text Component ─── */
function AnimatedText({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Split Text Animation ─── */
function SplitText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.3em]"
          style={{ transformOrigin: "bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="relative h-screen flex items-center">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl">
          <AnimatedText delay={0.2}>
            <span className="inline-block px-4 py-2 bg-[#5A7A3D]/10 text-[#5A7A3D] text-sm font-semibold tracking-wider uppercase rounded-full mb-6">
              Sustainable by Design
            </span>
          </AnimatedText>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-[#6B4F3A] leading-[0.95] mb-8">
            <SplitText text="Cups that" />
            <br />
            <span className="italic font-light text-[#5A7A3D]">
              <SplitText text="care for" />
            </span>
            <br />
            <SplitText text="tomorrow" />
          </h1>

          <AnimatedText delay={0.6} className="max-w-md">
            <p className="text-lg text-[#8B6F5A] leading-relaxed mb-8">
              Premium eco-friendly paper cups crafted for businesses that value
              sustainability without compromising quality.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.8}>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-[#5A7A3D] text-white rounded-full font-medium hover:bg-[#4A6A2D] transition-colors">
                Explore Products
              </button>
              <button className="px-8 py-4 border-2 border-[#6B4F3A] text-[#6B4F3A] rounded-full font-medium hover:bg-[#6B4F3A] hover:text-white transition-colors">
                Get Sample
              </button>
            </div>
          </AnimatedText>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[#8B6F5A]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#6B4F3A] to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Story Section ─── */
function StorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  return (
    <section ref={ref} className="min-h-screen flex items-center py-32">
      <motion.div style={{ opacity, y }} className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <AnimatedText>
              <span className="text-[#5A7A3D] text-sm font-semibold tracking-wider uppercase mb-4 block">
                Our Story
              </span>
            </AnimatedText>

            <h2 className="text-4xl md:text-6xl font-light text-[#6B4F3A] leading-tight mb-8">
              <SplitText text="Crafted with" />
              <br />
              <span className="italic text-[#5A7A3D]">
                <SplitText text="purpose" />
              </span>
            </h2>

            <AnimatedText delay={0.3}>
              <p className="text-xl text-[#8B6F5A] leading-relaxed mb-6">
                At ecoform, we believe that everyday choices can make an extraordinary
                difference. Every cup we create is a step toward a more sustainable future.
              </p>
            </AnimatedText>

            <AnimatedText delay={0.4}>
              <p className="text-lg text-[#A08070] leading-relaxed">
                Our cups are made from responsibly sourced paper, designed to decompose
                naturally while providing the premium feel your customers deserve.
              </p>
            </AnimatedText>
          </div>

          <div className="relative">
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#5A7A3D]/10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#C4A77D]/20"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Features Section ─── */
function FeaturesSection() {
  const features = [
    { icon: "♻️", title: "100% Recyclable", desc: "Fully recyclable materials" },
    { icon: "🛡️", title: "Double-Wall", desc: "Premium insulation" },
    { icon: "🎨", title: "Custom Print", desc: "Your brand, your style" },
    { icon: "🌱", title: "Eco-Certified", desc: "Responsibly sourced" },
  ];

  return (
    <section className="min-h-screen flex items-center py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <AnimatedText>
            <span className="text-[#5A7A3D] text-sm font-semibold tracking-wider uppercase mb-4 block">
              Why Choose Us
            </span>
          </AnimatedText>

          <h2 className="text-4xl md:text-6xl font-light text-[#6B4F3A] leading-tight">
            <SplitText text="Quality meets" />
            <br />
            <span className="italic text-[#5A7A3D]">
              <SplitText text="sustainability" />
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <AnimatedText key={feature.title} delay={i * 0.1}>
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/80 transition-colors">
                <span className="text-5xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-medium text-[#6B4F3A] mb-2">{feature.title}</h3>
                <p className="text-[#8B6F5A]">{feature.desc}</p>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Products Section ─── */
function ProductsSection() {
  const products = [
    { size: "4oz", name: "Espresso", price: "0.08", color: "#F5F1ED" },
    { size: "8oz", name: "Classic", price: "0.10", popular: true, color: "#C4A77D" },
    { size: "12oz", name: "Grande", price: "0.18", color: "#B89A6A" },
  ];

  return (
    <section className="min-h-screen flex items-center py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <AnimatedText>
            <span className="text-[#5A7A3D] text-sm font-semibold tracking-wider uppercase mb-4 block">
              Our Collection
            </span>
          </AnimatedText>

          <h2 className="text-4xl md:text-6xl font-light text-[#6B4F3A] leading-tight">
            <SplitText text="Choose your" />
            <br />
            <span className="italic text-[#5A7A3D]">
              <SplitText text="perfect size" />
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product, i) => (
            <AnimatedText key={product.size} delay={i * 0.15}>
              <div
                className={`relative rounded-3xl p-8 text-center transition-transform hover:-translate-y-2 ${
                  product.popular
                    ? "bg-[#5A7A3D] text-white"
                    : "bg-white/70 backdrop-blur-sm"
                }`}
              >
                {product.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C4A77D] text-[#4B3525] text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                )}

                <div
                  className="w-20 h-24 mx-auto mb-6 rounded-b-[40%] relative"
                  style={{
                    background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}dd 100%)`,
                    boxShadow: "inset -8px 0 20px rgba(0,0,0,0.1), inset 8px 0 20px rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="absolute -top-2 -left-1 -right-1 h-4 rounded-[50%]"
                    style={{ background: `linear-gradient(180deg, ${product.color} 0%, ${product.color}ee 100%)` }}
                  />
                </div>

                <span className={`text-xs font-bold tracking-wider ${product.popular ? "text-white/70" : "text-[#5A7A3D]"}`}>
                  {product.size}
                </span>
                <h3 className={`text-2xl font-medium mt-1 mb-4 ${product.popular ? "text-white" : "text-[#6B4F3A]"}`}>
                  {product.name}
                </h3>
                <p className={`text-sm mb-6 ${product.popular ? "text-white/80" : "text-[#8B6F5A]"}`}>
                  Single & Double Layer
                </p>
                <div className={product.popular ? "text-white/70" : "text-[#8B6F5A]"}>
                  From{" "}
                  <span className={`text-3xl font-medium ${product.popular ? "text-white" : "text-[#6B4F3A]"}`}>
                    {product.price}₾
                  </span>
                  /cup
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection() {
  return (
    <section className="min-h-screen flex items-center py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText>
            <span className="text-[#5A7A3D] text-sm font-semibold tracking-wider uppercase mb-4 block">
              Ready to Start?
            </span>
          </AnimatedText>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#6B4F3A] leading-tight mb-8">
            <SplitText text="Let's brew" />
            <br />
            <span className="italic text-[#5A7A3D]">
              <SplitText text="something great" />
            </span>
          </h2>

          <AnimatedText delay={0.4}>
            <p className="text-xl text-[#8B6F5A] max-w-2xl mx-auto mb-12">
              Ready to make the switch to sustainable cups? Get a custom quote or request
              free samples today.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-5 bg-[#5A7A3D] text-white text-lg rounded-full font-medium hover:bg-[#4A6A2D] transition-all hover:scale-105">
                Get Custom Quote
              </button>
              <button className="px-10 py-5 border-2 border-[#6B4F3A] text-[#6B4F3A] text-lg rounded-full font-medium hover:bg-[#6B4F3A] hover:text-white transition-colors">
                Request Samples
              </button>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.8}>
            <div className="mt-16 flex justify-center items-center gap-12 text-[#8B6F5A]">
              <div>
                <span className="text-4xl font-light text-[#6B4F3A]">500+</span>
                <p className="text-sm mt-1">Happy Clients</p>
              </div>
              <div className="w-px h-12 bg-[#D5CCC3]" />
              <div>
                <span className="text-4xl font-light text-[#6B4F3A]">100%</span>
                <p className="text-sm mt-1">Recyclable</p>
              </div>
              <div className="w-px h-12 bg-[#D5CCC3]" />
              <div>
                <span className="text-4xl font-light text-[#6B4F3A]">3</span>
                <p className="text-sm mt-1">Cup Sizes</p>
              </div>
            </div>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="py-12 border-t border-[#D5CCC3]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="ecoform" width={40} height={40} className="rounded" />
            <span className="text-[#6B4F3A] font-medium">ecoform</span>
          </div>
          <p className="text-sm text-[#8B6F5A]">© 2024 ecoform. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-[#8B6F5A]">
            <a href="#" className="hover:text-[#6B4F3A] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#6B4F3A] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#6B4F3A] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Export ─── */
export function CinematicSections() {
  return (
    <div className="relative z-10">
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <ProductsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
