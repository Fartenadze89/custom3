"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer className="relative bg-brown-dark text-cream overflow-hidden" ref={ref}>
      {/* Decorative top wave / diagonal */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-cream-light" style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)" }} />

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow */}
      <div className="absolute bottom-0 left-[20%] w-[500px] h-[300px] bg-green/5 rounded-full blur-[120px]" />

      <div className="relative pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[2rem] bg-gradient-to-br from-green via-green to-green-dark p-10 lg:p-14 mb-20 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-[40px]" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-white font-light mb-3">
                  Ready to go <em className="font-light italic text-kraft-light">green</em>?
                </h3>
                <p className="text-white/70 max-w-md">
                  Join 500+ businesses already making a difference with every cup they serve.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 bg-white text-green-dark px-8 py-4 rounded-full font-medium text-base hover:bg-cream hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 group flex-shrink-0"
              >
                Get Started
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Main footer content */}
          <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-12 mb-16 pb-12 border-b border-white/10">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <img
                src="/logo.jpeg"
                alt="ecoform"
                className="h-12 w-auto mb-5 brightness-0 invert opacity-80"
              />
              <p className="text-white/50 max-w-xs text-sm leading-relaxed mb-6">
                Premium eco-friendly paper cups crafted in Georgia for
                businesses that value sustainability.
              </p>
              {/* Social */}
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-green border border-white/10 hover:border-green flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-green border border-white/10 hover:border-green flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h4 className="font-[family-name:var(--font-display)] text-kraft text-lg mb-5">
                Products
              </h4>
              <div className="flex flex-col gap-3">
                {["4oz Espresso Cups", "8oz Classic Cups", "12oz Grande Cups", "Lids & Accessories"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#products"
                      className="text-white/50 hover:text-cream text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h4 className="font-[family-name:var(--font-display)] text-kraft text-lg mb-5">
                Company
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: "About Us", href: "#about" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/50 hover:text-cream text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/30">
              &copy; {new Date().getFullYear()} ecoform. All rights reserved.
            </p>
            <p className="text-xs text-white/20">
              Made with care in Tbilisi, Georgia 🇬🇪
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
