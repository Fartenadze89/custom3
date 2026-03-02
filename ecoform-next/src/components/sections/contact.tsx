"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, ArrowRight, Check, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    e.currentTarget.reset();
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cream-light" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green/[0.04] to-transparent hidden lg:block" />
      </div>
      {/* Decorative circles */}
      <div className="absolute top-[10%] right-[15%] w-72 h-72 border border-green/8 rounded-full hidden lg:block" />
      <div className="absolute top-[15%] right-[18%] w-48 h-48 border border-kraft/8 rounded-full hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-green bg-green/8 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            Get in Touch
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.75rem] font-light text-brown-dark leading-[1.1]">
            Let&apos;s brew
            <br />
            <em className="text-green font-light italic">something great</em>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-brown-light mb-10 max-w-md text-lg leading-relaxed">
              Ready to make the switch to sustainable cups? Get a custom quote
              or request free samples — we&apos;d love to hear from you.
            </p>

            <div className="space-y-4 mb-10">
              {[
                {
                  icon: Phone,
                  label: "Call us",
                  value: "+995 555 123 456",
                  href: "tel:+995555123456",
                },
                {
                  icon: Mail,
                  label: "Email us",
                  value: "info@ecoform.ge",
                  href: "mailto:info@ecoform.ge",
                },
                {
                  icon: MapPin,
                  label: "Visit us",
                  value: "Tbilisi, Georgia",
                  href: "#",
                },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="group flex items-center gap-4 p-5 bg-white rounded-2xl hover:translate-x-2 hover:shadow-xl hover:shadow-brown/8 transition-all duration-500 border border-transparent hover:border-green/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green group-hover:shadow-lg group-hover:shadow-green/25 transition-all duration-300">
                    <item.icon size={20} className="text-green group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs text-brown-light/60 uppercase tracking-wider">{item.label}</span>
                    <strong className="text-lg text-brown group-hover:text-brown-dark transition-colors">{item.value}</strong>
                  </div>
                  <ArrowRight size={16} className="text-brown-light/30 group-hover:text-green group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}
            </div>

            {/* Business hours */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-3 text-sm text-brown-light/60"
            >
              <Clock size={14} />
              <span>Mon – Fri, 9:00 – 18:00 (GMT+4)</span>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-brown/8 border border-cream-dark/20 relative overflow-hidden"
            >
              {/* Decorative corner */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-green/5 rounded-full" />

              <div className="relative">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-brown-dark mb-1">
                  Request a Quote
                </h3>
                <p className="text-sm text-brown-light/60 mb-8">
                  Fill in the details and we&apos;ll get back to you within 24 hours
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        focusedField === "name" ? "text-green" : "text-brown"
                      }`}
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="bg-cream-light/50 border-cream-dark/30 focus:border-green focus:bg-white rounded-xl h-12 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        focusedField === "company" ? "text-green" : "text-brown"
                      }`}
                    >
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      onFocus={() => setFocusedField("company")}
                      onBlur={() => setFocusedField(null)}
                      className="bg-cream-light/50 border-cream-dark/30 focus:border-green focus:bg-white rounded-xl h-12 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === "email" ? "text-green" : "text-brown"
                    }`}
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="bg-cream-light/50 border-cream-dark/30 focus:border-green focus:bg-white rounded-xl h-12 transition-all duration-300"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="quantity"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === "quantity" ? "text-green" : "text-brown"
                    }`}
                  >
                    Estimated Monthly Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    onFocus={() => setFocusedField("quantity")}
                    onBlur={() => setFocusedField(null)}
                    className="flex h-12 w-full rounded-xl border-2 border-cream-dark/30 bg-cream-light/50 px-3 text-sm text-brown focus:border-green focus:bg-white focus:outline-none transition-all duration-300"
                  >
                    <option value="">Select quantity</option>
                    <option value="500-1000">500 - 1,000 cups</option>
                    <option value="1000-3000">1,000 - 3,000 cups</option>
                    <option value="3000-10000">3,000 - 10,000 cups</option>
                    <option value="10000+">10,000+ cups</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === "message" ? "text-green" : "text-brown"
                    }`}
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your needs..."
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="bg-cream-light/50 border-cream-dark/30 focus:border-green focus:bg-white rounded-xl resize-y min-h-[120px] transition-all duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-green text-white hover:bg-green-dark h-13 text-base shadow-xl shadow-green/25 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green/30 transition-all duration-300 group"
                >
                  {submitted ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} /> Message Sent!
                    </motion.span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
