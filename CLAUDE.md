# ArchLab Website

## Project Overview
ArchLab AI marketing website — a static site built with Astro + Tailwind CSS, deployed to Cloudflare Pages.

ArchLab is an AI startup building precision-first architecture tools: dimension extraction from sketches/photos, CAD export, and photorealistic 3D rendering. The website serves as the pre-launch marketing site with waitlist capture.

## Tech Stack
- **Framework:** Astro 5.x (static output)
- **Styling:** Tailwind CSS 3.x + CSS custom properties in `src/styles/global.css`
- **Deployment:** Cloudflare Pages (auto-deploy from GitHub `main` branch)
- **Domain:** archlab.pro

## Project Structure
```
src/
  components/    # Reusable components (Nav, Footer)
  layouts/       # BaseLayout wraps all pages
  pages/         # Each .astro file = one route
    use-cases/   # Sub-pages for specific use cases
  styles/        # global.css with brand tokens + all component styles
public/
  assets/        # Images (WebP, PNG, SVG)
```

## Key Files
- `src/layouts/BaseLayout.astro` — Wraps every page with Nav, Footer, meta tags, and global scripts (scroll reveal, accordion, forms)
- `src/styles/global.css` — All CSS including brand tokens as CSS custom properties
- `src/components/Nav.astro` — Fixed nav with desktop dropdown + mobile hamburger menu
- `src/components/Footer.astro` — Site-wide footer

## Brand Tokens (CSS Custom Properties)
```css
--bg-dark: #0B1222;
--bg-alt: #0F1A2E;
--primary: #2563EB;
--accent: #06B6D4;
--cta-gradient: linear-gradient(135deg, #2563EB, #06B6D4);
```

## Pages (15 total)
- `/` — Homepage with hero, trust bar, use case cards, stats, testimonial
- `/how-it-works` — Three-step pipeline explanation
- `/for-firms` — Enterprise/firm sales page with demo form
- `/waitlist` — Waitlist signup form
- `/investors` — Investor-facing page
- `/about` — Team and company story
- `/use-cases/renovation` — Renovation as-builts use case
- `/use-cases/sketch-to-cad` — Sketch to CAD use case
- `/use-cases/redecoration` — Room redecoration use case
- `/use-cases/pitch-visuals` — Pitch visuals use case
- `/case-studies` — Pilot results from C3D Architects
- `/faq` — FAQ with accordion
- `/contact` — Contact form and info
- `/privacy` — Privacy policy
- `/terms` — Terms of service

## Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build to dist/
npm run preview      # Preview production build
```

## Deployment
Push to `main` branch on GitHub. Cloudflare Pages auto-builds and deploys.

Build settings in Cloudflare:
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 18+

## Notes
- All images are in `public/assets/` (WebP format for photos, SVG for Integra.Nos logo, PNG for ArchLab logos)
- Forms currently use client-side placeholder handling — backend integration TBD
- The `.reveal` CSS class triggers scroll-based fade-in animations via Intersection Observer in BaseLayout
- SEO: each page has unique title, description, and keywords via BaseLayout props
