

# Add Scroll Animations & Testimonial Section to Landing Page

## What we're building
- Intersection Observer-based scroll animations so sections fade/slide in as users scroll
- A testimonial section between Features and the page footer with 3 editorial-style quotes

## Plan

### 1. Create a reusable scroll animation hook
**New file: `src/hooks/useScrollAnimation.ts`**
- Custom hook using `IntersectionObserver` to detect when elements enter the viewport
- Returns a ref and a boolean `isVisible` state
- Configurable threshold (default 0.15)

### 2. Create an animated wrapper component
**New file: `src/components/ScrollReveal.tsx`**
- Wraps children in a div that applies opacity/translate transitions when visible
- Props: `delay`, `direction` (up/left/right), `className`
- Uses CSS transitions (not keyframes) for smooth scroll-triggered animation

### 3. Update the landing page (`src/pages/Index.tsx`)
- Wrap each feature card and the new testimonial cards in `<ScrollReveal>`
- Add staggered delays to feature cards (0ms, 150ms, 300ms)

**New Testimonial Section** (between Features and page end):
- Section heading: "What food lovers are saying"
- 3 testimonial cards in a responsive grid, each with:
  - Quote text (editorial, on-brand tone)
  - Author name, city, and avatar placeholder
- Example quotes:
  - "Tasterra found me a hidden ramen spot in the East Village I never would've discovered on my own. It's like having a friend who's eaten everywhere." — Maya R., NYC
  - "I used Traveler Mode for my Chicago trip and every single meal was a hit. No more wasting a dinner on a tourist trap." — James K., DC
  - "The vibe matching is unreal. I said 'cozy date night' and it nailed it on the first try." — Sofia L., LA

### 4. Add scroll animation CSS to `src/index.css`
- Add utility classes for scroll reveal transitions:
  - `.scroll-reveal`: base state (opacity 0, translateY 20px, transition 0.6s)
  - `.scroll-reveal.visible`: visible state (opacity 1, translateY 0)

## Technical details
- No external animation library needed — pure Intersection Observer + CSS transitions
- Testimonial avatars use the existing Avatar component with colored fallback initials
- All new sections respect dark mode via existing Tailwind tokens

