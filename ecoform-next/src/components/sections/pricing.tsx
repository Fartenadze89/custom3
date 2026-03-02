"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Info, Sparkles, ArrowRight } from "lucide-react";
import { pricingData, type CupSize } from "@/lib/pricing-data";

const sizes: { label: string; value: CupSize; icon: string }[] = [
  { label: "4 OZ", value: "4oz", icon: "☕" },
  { label: "8 OZ", value: "8oz", icon: "🍵" },
  { label: "12 OZ", value: "12oz", icon: "🥤" },
];

export function Pricing() {
  const [activeSize, setActiveSize] = useState<CupSize>("8oz");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const data = pricingData[activeSize];

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Dramatic dark background with texture */}
      <div className="absolute inset-0 bg-brown-dark" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glowing orbs */}
      <div className="absolute top-0 right-[20%] w-[500px] h-[500px] bg-green/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-kraft/8 rounded-full blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-kraft/80 bg-kraft/10 px-4 py-2 rounded-full mb-5">
            <Sparkles size={12} />
            Transparent Pricing
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.75rem] font-light text-cream leading-[1.1] mb-5">
            Better prices for
            <br />
            <em className="text-kraft-light font-light italic">bigger orders</em>
          </h2>
          <p className="text-cream-dark/70 text-lg">
            Volume discounts that grow with your business. All prices include VAT.
          </p>
        </motion.div>

        {/* Size selector — pill tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex gap-1.5 p-1.5 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
            {sizes.map((s) => (
              <button
                key={s.value}
                onClick={() => setActiveSize(s.value)}
                className={`relative px-7 py-3 rounded-full text-sm font-medium transition-all duration-400 ${
                  activeSize === s.value
                    ? "text-brown-dark"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                {activeSize === s.value && (
                  <motion.div
                    layoutId="pricingTab"
                    className="absolute inset-0 bg-kraft rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing content — two side-by-side cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSize}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-6 mb-12"
          >
            {/* Without Logo */}
            <div className="bg-white/[0.04] backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:bg-white/[0.06] transition-colors duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                  <span className="text-green-light text-sm font-bold">★</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-cream">Without Logo</h3>
                  <p className="text-xs text-cream-dark/50">Stock cups, ready to ship</p>
                </div>
              </div>

              <div className="space-y-1">
                {/* Column headers */}
                <div className="grid grid-cols-4 gap-3 pb-3 border-b border-white/10">
                  {["Qty", "Single", "Dbl White", "Dbl Kraft"].map((h) => (
                    <span key={h} className="text-[10px] uppercase tracking-wider text-cream-dark/40 text-center font-medium">
                      {h}
                    </span>
                  ))}
                </div>
                {data.withoutLogo.map((row, i) => (
                  <div
                    key={`wol-${i}`}
                    className="grid grid-cols-4 gap-3 py-3 border-b border-white/5 group hover:bg-white/5 rounded-lg transition-colors px-2"
                  >
                    <span className="text-center font-semibold text-cream text-sm">{row.quantity}</span>
                    <span className="text-center text-kraft-light text-sm font-medium">{row.singleWhite}</span>
                    <span className="text-center text-kraft-light text-sm font-medium">{row.doubleWhite}</span>
                    <span className="text-center text-kraft-light text-sm font-medium">{row.doubleKraft}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* With Logo */}
            <div className="bg-white/[0.04] backdrop-blur-sm rounded-3xl border border-kraft/20 p-8 relative overflow-hidden hover:bg-white/[0.06] transition-colors duration-500">
              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-kraft/10 rounded-full blur-[60px]" />

              <div className="relative flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-kraft/20 flex items-center justify-center">
                  <span className="text-kraft text-sm font-bold">✦</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-cream">With Custom Logo</h3>
                  <p className="text-xs text-cream-dark/50">Branded cups, your identity</p>
                </div>
              </div>

              <div className="relative space-y-1">
                <div className="grid grid-cols-4 gap-3 pb-3 border-b border-white/10">
                  {["Qty", "Single", "Dbl White", "Dbl Kraft"].map((h) => (
                    <span key={h} className="text-[10px] uppercase tracking-wider text-cream-dark/40 text-center font-medium">
                      {h}
                    </span>
                  ))}
                </div>
                {data.withLogo.map((row, i) => (
                  <motion.div
                    key={`wl-${i}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="grid grid-cols-4 gap-3 py-3 border-b border-white/5 group hover:bg-white/5 rounded-lg transition-colors px-2"
                  >
                    <span className="text-center font-semibold text-cream text-sm">{row.quantity}</span>
                    <span className="text-center text-kraft-light text-sm font-medium">{row.singleWhite}</span>
                    <span className="text-center text-kraft-light text-sm font-medium">{row.doubleWhite}</span>
                    <span className="text-center text-kraft-light text-sm font-medium">{row.doubleKraft}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Info callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-r from-green/10 to-kraft/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16"
        >
          <div className="w-12 h-12 rounded-full bg-kraft flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-brown-dark" />
          </div>
          <div className="flex-1">
            <strong className="block text-cream mb-0.5">Need a custom quote?</strong>
            <p className="text-cream-dark/60 text-sm">
              Orders over 10,000 cups qualify for custom pricing. Contact us for
              a personalized quote tailored to your needs.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-kraft hover:text-kraft-light transition-colors group/link flex-shrink-0"
          >
            Get Quote
            <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
          </a>
        </motion.div>

        {/* Accessories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-cream mb-1">
              Accessories
            </h3>
            <p className="text-cream-dark/50 text-sm">Complete the experience</p>
          </div>
          <div className="flex justify-center gap-5">
            {[
              { name: "8oz Lid", price: "0.07₾" },
              { name: "12oz Lid", price: "0.08₾" },
            ].map((acc, i) => (
              <motion.div
                key={acc.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                className="group bg-white/[0.04] backdrop-blur-sm rounded-2xl px-10 py-7 text-center border border-white/10 hover:border-kraft/30 hover:bg-white/[0.07] hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-10 h-10 text-kraft transition-transform duration-500 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <ellipse cx="12" cy="6" rx="8" ry="3" />
                    <path d="M4 6v2c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                  </svg>
                </div>
                <span className="block text-cream font-medium mb-1">{acc.name}</span>
                <span className="font-[family-name:var(--font-display)] text-2xl text-kraft-light">
                  {acc.price}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
