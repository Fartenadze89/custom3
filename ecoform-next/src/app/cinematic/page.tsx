"use client";

import { useRef, useEffect, useState } from "react";
import { CinematicCanvas } from "@/components/cinematic/cinematic-scene";
import { CinematicSections } from "@/components/cinematic/cinematic-sections";
import Image from "next/image";

export default function CinematicPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Calculate scroll progress
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Loading animation
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative bg-[#E5DDD5]">
      {/* Loading overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#E5DDD5] flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <Image src="/logo.jpeg" alt="ecoform" width={80} height={80} className="mx-auto mb-4 rounded-lg animate-pulse" />
          <p className="text-[#8B6F5A] text-sm tracking-wider">Loading experience...</p>
        </div>
      </div>

      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Image src="/logo.jpeg" alt="ecoform" width={48} height={48} className="rounded-lg" />
          <div className="hidden md:flex items-center gap-8 text-[#6B4F3A]">
            <a href="#" className="hover:text-[#5A7A3D] transition-colors">Products</a>
            <a href="#" className="hover:text-[#5A7A3D] transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#5A7A3D] transition-colors">About</a>
            <a
              href="#"
              className="px-6 py-2 bg-[#6B4F3A] text-[#E5DDD5] rounded-full hover:bg-[#5A3F2A] transition-colors"
            >
              Get Quote
            </a>
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#D5CCC3]">
        <div
          className="h-full bg-[#5A7A3D] transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* 3D Canvas (fixed, behind content) */}
      <CinematicCanvas scrollProgress={scrollProgress} />

      {/* Scroll sections (on top of canvas) */}
      <CinematicSections />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
