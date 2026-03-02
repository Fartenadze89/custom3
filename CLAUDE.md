# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ecoform** — a single-page marketing website for an eco-friendly paper cup company based in Georgia. Static site with no build system, framework, or package manager.

## Development

Open `index.html` directly in a browser or serve with any static file server (e.g., `npx serve .` or `python -m http.server`). There is no build step, no bundler, no linter, and no tests.

## Architecture

Three files make up the entire site:

- **index.html** — Full page markup with sections: hero (3D canvas), products, pricing, about, contact form, footer
- **styles.css** — All styles using CSS custom properties defined in `:root` (brand colors, typography, spacing). Responsive breakpoints at 968px and 768px.
- **app.js** — Two main parts:
  1. `CupScene` class — Three.js r128 (loaded via CDN) scene that renders interactive 3D paper cups in the hero `#cup-canvas`. Supports mouse/touch drag rotation and parallax.
  2. `initUI()` function — Handles pricing tab switching (data in `pricingData` object), smooth scroll, contact form submission (client-side only, logs to console), IntersectionObserver scroll animations, and navbar scroll state.

## Key Conventions

- **Fonts**: Fraunces (display/headings) and DM Sans (body) via Google Fonts CDN
- **Color palette**: cream/brown/green/kraft theme — all defined as CSS custom properties (`--cream`, `--brown`, `--green`, `--kraft` and their light/dark variants)
- **Currency**: Georgian Lari (₾) — prices are hardcoded in the `pricingData` object in app.js
- **Logo**: `file.enc.jpeg` — used in both nav and footer
- **No backend**: Contact form only does `console.log` + `alert`; pricing data is static JS
