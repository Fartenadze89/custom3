"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProductCupCanvas = dynamic(
  () =>
    import("./product-cup-3d").then((m) => ({
      default: m.ProductCupCanvas,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-kraft border-t-green animate-spin" />
      </div>
    ),
  }
);

/* ─── Product definitions with 3D geometry params ─── */
const PRODUCTS = [
  {
    id: "4oz",
    label: "4 OZ",
    name: "Espresso Cup",
    description:
      "Perfect for espresso, macchiato, and small tastings. Compact yet premium.",
    features: [
      "Single layer (White)",
      "Double layer (Kraft/White)",
      "Custom logo printing",
    ],
    priceFrom: "0.08₾",
    topRadius: 0.5,
    bottomRadius: 0.38,
    height: 1.0,
  },
  {
    id: "8oz",
    label: "8 OZ",
    name: "Classic Cup",
    description:
      "The standard choice for cappuccinos, flat whites, and your signature blends.",
    features: [
      "Single layer (White)",
      "Double layer (Kraft/White)",
      "Custom logo printing",
      "Matching lids available",
    ],
    priceFrom: "0.10₾",
    featured: true,
    topRadius: 0.65,
    bottomRadius: 0.48,
    height: 1.4,
  },
  {
    id: "12oz",
    label: "12 OZ",
    name: "Grande Cup",
    description:
      "Ideal for lattes, americanos, and iced drinks. Maximum capacity, minimum waste.",
    features: [
      "Single layer (White)",
      "Double layer (Kraft/White)",
      "Custom logo printing",
      "Matching lids available",
    ],
    priceFrom: "0.18₾",
    topRadius: 0.7,
    bottomRadius: 0.52,
    height: 1.6,
  },
];

const VARIANTS = [
  {
    id: "kraft",
    label: "Kraft",
    color: "#C4A77D",
    rimColor: "#D4C7A0",
    isKraft: true,
    swatch: "bg-gradient-to-br from-kraft to-kraft-dark",
  },
  {
    id: "white",
    label: "White",
    color: "#F5F1ED",
    rimColor: "#F0EDE9",
    isKraft: false,
    swatch: "bg-gradient-to-br from-white to-cream-dark border border-cream-dark/40",
  },
  {
    id: "mixed",
    label: "Mixed",
    color: "#E8DFD4",
    rimColor: "#D4C7A0",
    isKraft: false,
    swatch: "bg-[linear-gradient(135deg,#fff_50%,#C4A77D_50%)]",
  },
];

export function Products() {
  const [activeProduct, setActiveProduct] = useState(1); // 8oz default
  const [activeVariant, setActiveVariant] = useState(0); // kraft default
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const product = PRODUCTS[activeProduct];
  const variant = VARIANTS[activeVariant];

  return (
    <section
      id="products"
      className="relative py-28 lg:py-36 bg-cream-light overflow-hidden"
    >
      {/* Background decor */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-cream to-transparent" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-green/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-48 w-[400px] h-[400px] rounded-full bg-kraft/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-green bg-green/8 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            Interactive Showcase
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.75rem] font-light text-brown-dark leading-[1.1]">
            Choose Your
            <br />
            <em className="text-green font-light italic">Perfect Cup</em>
          </h2>
        </motion.div>

        {/* ── Main showcase ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-14 items-center max-w-6xl mx-auto"
        >
          {/* ── LEFT: info ── */}
          <div className="order-2 lg:order-1">
            {/* Size selector tabs */}
            <div className="flex gap-3 mb-10">
              {PRODUCTS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProduct(i)}
                  className={`relative flex-1 py-4 px-3 rounded-2xl text-center transition-all duration-500 cursor-pointer ${
                    activeProduct === i
                      ? "bg-white shadow-xl shadow-brown/8"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                >
                  {p.featured && activeProduct === i && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green text-white border-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                      Popular
                    </Badge>
                  )}
                  <span
                    className={`block font-[family-name:var(--font-display)] text-2xl mb-0.5 transition-colors ${
                      activeProduct === i
                        ? "text-brown-dark"
                        : "text-brown-light"
                    }`}
                  >
                    {p.label}
                  </span>
                  <span
                    className={`text-xs transition-colors ${
                      activeProduct === i
                        ? "text-green font-medium"
                        : "text-brown-light/60"
                    }`}
                  >
                    From {p.priceFrom}
                  </span>
                </button>
              ))}
            </div>

            {/* Product details — animate on change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="font-[family-name:var(--font-display)] text-3xl text-brown-dark mb-3">
                  {product.name}
                </h3>
                <p className="text-brown-light text-lg leading-relaxed mb-8 max-w-md">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {product.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex items-center gap-3 text-brown-light"
                    >
                      <span className="w-5 h-5 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-green" />
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-end gap-6">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-brown-light">
                      Starting from
                    </span>
                    <span className="block font-[family-name:var(--font-display)] text-4xl font-medium text-brown-dark leading-none mt-1">
                      {product.priceFrom}
                    </span>
                    <span className="text-sm text-brown-light">/cup</span>
                  </div>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 bg-green text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-green-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green/25 transition-all duration-300 group"
                  >
                    See Full Pricing
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: 3D cup ── */}
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/3.5] sm:aspect-square max-w-[520px] mx-auto relative">
              {/* Soft glow behind cup */}
              <div className="absolute inset-[12%] bg-kraft/12 rounded-full blur-[70px] pointer-events-none" />
              <ProductCupCanvas
                target={{
                  topRadius: product.topRadius,
                  bottomRadius: product.bottomRadius,
                  height: product.height,
                }}
                variant={{
                  color: variant.color,
                  isKraft: variant.isKraft,
                  rimColor: variant.rimColor,
                }}
              />
            </div>

            {/* Variant swatches under the 3D cup */}
            <div className="flex justify-center gap-2.5 -mt-2 relative z-10">
              {VARIANTS.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(i)}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeVariant === i
                      ? "bg-white shadow-lg shadow-brown/10 scale-105"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${v.swatch} ${
                      activeVariant === i
                        ? "border-green scale-110"
                        : "border-cream-dark"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors ${
                      activeVariant === i
                        ? "text-brown-dark"
                        : "text-brown-light"
                    }`}
                  >
                    {v.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Hint text */}
            <p className="text-center text-[10px] text-brown-light/40 tracking-widest uppercase mt-3">
              Cup rotates automatically
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
