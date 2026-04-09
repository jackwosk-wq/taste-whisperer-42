# Tasterra — Project Brief
*Last updated: April 7, 2026*

---

## What We're Building
An AI-powered restaurant discovery app built around a conversational chat interface. Users talk to the AI like a well-traveled, food-obsessed friend to get personalized restaurant recommendations.

**Tagline:** Tasterra blends "taste" + "terra" (land/earth) — exploring the culinary landscape of wherever you are.

---

## Full Tech Stack

| Category | Decision |
|---|---|
| Platform | Web (React + Vite, via Lovable scaffold) → eventually Next.js + React Native/Expo |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL + auth + real-time) — not yet connected in prototype |
| AI Model | GPT-4o (OpenAI) |
| Restaurant Data | Google Places API (Legacy + New) ✅ + Yelp Fusion API ✅ |
| Auth | Email + Password, Google SSO, Apple Sign-In |
| Analytics | PostHog (user behavior) + Sentry (error/crash monitoring) |
| UI Components | shadcn/ui + Tailwind CSS |
| Dev Tools | Google Antigravity (IDE) + Claude Code + Lovable + Cursor |

---

## API Keys & Configuration

| Key | Status | Location |
|---|---|---|
| Google Places API (`VITE_GOOGLE_PLACES_API_KEY`) | ✅ Active | `.env` |
| Yelp Fusion API (`VITE_YELP_API_KEY`) | ✅ Active (Base tier) | `.env` |
| OpenAI API key | ⬜ Still needed | platform.openai.com |
| Supabase project | ⬜ When moving to real backend | — |

**Google Cloud Project ID:** `126965570985`
**APIs enabled:** Places API (Legacy) ✅, Places API (New) ✅

**Yelp Note:** Base tier does NOT include Business Search (`/businesses/search`). Returns `UNAUTHORIZED_ACCESS_TOKEN`. The key is saved but currently non-functional for API calls. Yelp price/cuisine fallback is in the code but silently returns empty strings. Upgrade to paid tier would unlock it.

---

## Vite Dev Server Proxy Config (`vite.config.ts`)

```typescript
proxy: {
  // Legacy Places API (autocomplete, kept as working fallback)
  "/places-proxy": {
    target: "https://maps.googleapis.com/maps/api/place",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/places-proxy/, ""),
  },
  // Places API (New) — details, photos
  "/places-new": {
    target: "https://places.googleapis.com",
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/places-new/, "/v1"),
  },
  // Yelp Fusion API — price/cuisine fallback (Base tier currently blocked)
  "/yelp-proxy": {
    target: "https://api.yelp.com/v3",
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/yelp-proxy/, ""),
  },
},
```

---

## Restaurant Search Architecture (`src/hooks/usePlacesSearch.ts`)

**Hybrid approach (most reliable):**
- **Autocomplete:** `GET /places-proxy/autocomplete/json` (Legacy Places API — GET request, no CORS issues, proven stable)
- **Details:** `GET /places-new/places/{placeId}` (Places API New — returns `primaryType`, `priceLevel`, `photos`, `formattedAddress`)
- **Photos:** `GET /places-new/{photoName}/media?skipHttpRedirect=true` → returns `{ photoUri: "..." }`

**Cuisine resolution priority:**
1. Google `primaryType` → mapped via `PRIMARY_TYPE_MAP` (50+ types including `afghani_restaurant`, `deli`, etc.)
2. Yelp `categories[0].title` (if Yelp is available — currently blocked on Base tier)
3. Name-based keyword patterns (`cuisineFromName()`) — catches "osteria" → Italian, "taqueria" → Mexican, "occidental" → American Steakhouse, etc.
4. Final fallback: "Restaurant"

**Price resolution priority:**
1. Google `priceLevel` enum → `PRICE_LEVEL_INEXPENSIVE` = `$`, `PRICE_LEVEL_MODERATE` = `$$`, `PRICE_LEVEL_EXPENSIVE` = `$$$`, `PRICE_LEVEL_VERY_EXPENSIVE` = `$$$$`
2. Yelp `price` field (if available)
3. Empty string (no price shown)

**Important:** Yelp is only called when Google is missing price OR cuisine — single combined call, not two separate ones.

---

## V1 Features (MVP)

1. **AI Chat Discovery** — core conversational interface, natural language restaurant recommendations
2. **Vibe & Mood-Based Filtering** — romantic, buzzy, low-key, hidden gem, etc.
3. **Hidden Gem Surfacing** — actively prioritizes lesser-known, underrated spots
4. **Traveler Mode** — full dining itinerary builder for trips (breakfast/lunch/dinner across multiple days)
5. **Map View** — after AI surfaces results, user sees restaurant pins on a map relative to their current location

---

## V2 Features (Priority Order)

1. **Group Recommendations** *(top priority)* — AI synthesizes one rec for multiple people's preferences
2. **Social & Friend Layer** — follow friends, see saves, activity feed
3. **Push Notifications** — new hidden gems, personalized alerts
4. **Tasterra Pro Paywall** — ~$7.99/month, details TBD, focus on userbase first

---

## V2/V3 Features (Lower Priority)

- **Tastemaker Lists** — curated lists from local food bloggers, chefs, critics
- **Recipes** — recreate favorite dishes at home
- **Allergy Filtering** — high priority for Mia's audience (@allergieswithmia)

---

## Design Direction

| Element | Decision |
|---|---|
| UI Inspiration | Beli's color palette + warmth meets Claude/ChatGPT chat interface |
| Feel | Polished, warm, editorial, food-forward — never boring |
| Color | Rich earth tones — burnt orange (#C2622A), warm creams (#F7F3EE), deep browns (#1C1410), gold accents (#C49A2A) |
| Typography | Playfair Display (headings) + Inter (body) |
| Modes | Dark mode + Light mode both supported |
| Layout | Chat-first. Map view secondary (pins on map after AI results) |

---

## Geographic Launch

- **Baseline:** NYC + LA (non-negotiable)
- **Also at launch:** Chicago, Miami, DC (DC prioritized — Jack is based there)
- All powered by Google Places API — data coverage is solid in all 5 cities

---

## Monetization

- **Freemium model** — launch free to build userbase, paywall in V2/V3
- Free tier: core AI chat, standard discovery, limited saves
- **Tasterra Pro** (~$7.99/month, details TBD): power features for serious food lovers

---

## Outreach Strategy

**Mia (@allergieswithmia)**
- Childhood best friend's sister, content creator in the allergy space
- ~40K Instagram followers
- High-intent restaurant discovery audience
- Consider building allergy filtering as a feature so her audience has a genuine reason to use it
- **When to reach out:** Once V1 is solid and polished

**Personal Network**
- Foodie friends and family friends in major cities
- College friends who are active Beli users — pre-qualified Tasterra users

**Outreach Sequence:**
1. Close friends + family → beta feedback
2. Beli-heavy friend group → organic early adopters
3. Mia → one post to 40K engaged followers in a relevant niche

---

## Class Assignment (MKTG 4900 — Architecture of Marketing, GWU)

**Homework 6: Generative Webpage**
- Generate an AI-created webpage for Tasterra in `.html` format
- Use real images from the internet (not AI-generated)
- Have AI correct errors on the page
- Submit: final `.html` file + narrative discussion of changes made
- ✅ Static HTML prototype already generated at: `tasterra_prototype.html`
- The Lovable-built React app is the better, more polished version to use going forward

---

## AI Tools & Resources Being Leveraged

### Lovable (lovable.dev)
- AI-powered full-stack app builder — describe the app in plain English, it generates production-ready React/TypeScript
- **Used to:** Generate the Tasterra V1 prototype scaffold
- **Repo:** https://github.com/jackwosk-wq/taste-whisperer-42 (public)
- **Workflow:** Lovable generates the scaffold → Claude Code handles surgical edits, debugging, complex logic
- **Migration:** When ready, can export to GitHub and self-host on Vercel

### Google Antigravity IDE (antigravity.google)
- Google's agent-first IDE (VS Code fork) with built-in AI agents
- **Downloaded and installed** ✅
- **Model selected:** Claude Sonnet 4.6 (switched from Gemini 3.1 Pro High)
- **Integration with Claude Code:** Run `claude` in Antigravity's built-in terminal
- **DO NOT use the antigravity-claude-proxy** — Google has been banning accounts that use it
- **Workflow:**
  - Antigravity → visual orchestration, browser preview, multi-agent planning
  - Claude Code (terminal inside Antigravity) → code writing, debugging, complex logic
  - Handoff via `implementation_plan.md` artifacts between the two

### Manus (manus.im)
- Autonomous AI agent (acquired by Meta) — goes beyond chat, independently plans and executes
- **Web App Builder:** Generates full-stack apps (frontend + backend + database + Stripe + auth) from natural language
- **Tasterra use case:** Could generate a rapid full-stack prototype or landing page, then refine in Claude Code

### 21st.dev (21st.dev)
- "npm for design engineers" — largest React component registry (1.4M developers, v2.0 launched March 2026)
- Hundreds of copy-paste React/Next.js components: chat UIs, cards, animations, 3D, etc.
- **Tasterra use case:** Pull pre-built components (chat UI, restaurant cards, map overlays) directly into Next.js codebase
- Components drop straight into the existing Tailwind + shadcn/ui stack

### Cursor
- AI-powered code editor (listed as dev tool in original brief)
- Use for local development alongside Claude Code

---

## Current Build Status

### Folder Structure
```
CLAUDE CODE LIFELINE/
  TASTERRA/                          ← Active codebase (renamed from tasterra-lovable)
    src/
      context/AuthContext.tsx        # Auth + onboarding state (localStorage)
      pages/AuthPage.tsx             # Sign in/up
      pages/OnboardingPage.tsx       # 4-step onboarding + Google Places search
      pages/Discover.tsx             # Main chat + results page
      pages/TravelerMode.tsx         # Trip itinerary builder
      pages/SavedPage.tsx            # Saved restaurants
      pages/Index.tsx                # Landing page
      components/Navbar.tsx          # Top nav (hidden on /auth and /onboarding)
      components/ChatPanel.tsx       # Chat UI with markdown rendering
      hooks/usePlacesSearch.ts       # Restaurant search hook (Google + Yelp fallback)
      data/restaurants.ts            # Hardcoded restaurant data (5 cities)
      data/chatResponses.ts          # Mock AI responses per vibe
    App.tsx                          # Routing + auth guards
    vite.config.ts                   # Proxy config for Google + Yelp APIs
    .env                             # API keys (Google Places + Yelp)
    tasterra_project_brief.md        # This file
    tasterra_prototype.html          # Old static HTML prototype (MKTG class)
```

### Pages Built
- `/auth` — Sign in/up with Google, Apple, and email (functional, saves to localStorage)
- `/onboarding` — 4-step onboarding flow (required, not skippable)
- `/` — Hero landing page
- `/discover` — Main chat + restaurant results + map view
- `/traveler` — Traveler mode (day-by-day dining itinerary builder)
- `/saved` — Saved restaurants page

### Onboarding Flow (4 steps)
1. Favorite cuisines — tap-to-select chips + free text custom add
2. Home city — 5 launch cities
3. Age — number input (used to tune targeting)
4. Favorite restaurants — live Google Places search with photo + cuisine + price cards

### Bugs Fixed (April 7, 2026 session)
- ✅ **Navbar showing on onboarding page** — Fixed in `App.tsx`: `showNav` now also checks `pathname !== "/onboarding" && pathname !== "/auth"`
- ✅ **Restaurant search spinner never resolving** — Root cause: `@googlemaps/js-api-loader` v2.0.2 removed the `Loader` class entirely. Fixed by dropping the package and using Vite proxies instead.
- ✅ **CORS blocking Places API** — Fixed via Vite dev server proxy (`/places-proxy`, `/places-new`)
- ✅ **Places API New POST timeout** — Switched autocomplete to Legacy API GET (more stable); kept Places API New for details (GET only)
- ✅ **Cuisine showing "Restaurant"** — Fixed with 3-tier fallback: Google `primaryType` → Yelp categories → name keywords
- ✅ **`afghani_restaurant` not in map** — Added (Google spells it with an "i")
- ✅ **`deli` type not in map** — Added
- ✅ **"The Occidental" showing "Restaurant"** — Added name keyword pattern `occidental` → "American Steakhouse"
- ✅ **Traveler Mode ignoring selected city** — Fixed `generateItinerary` + `regenerateMeal` to use `getRestaurantsByCity(city)`
- ✅ **ChatPanel not rendering italic markdown** — Fixed split regex to catch `*italic*` patterns

---

## Dev Environment

- **Run the app:** `cd "/Users/bigjackman55/Desktop/CLAUDE CODE LIFELINE/TASTERRA" && npm run dev`
- **View in browser:** http://localhost:8080 (falls back to 8081 if occupied)
- **GitHub repo:** https://github.com/jackwosk-wq/taste-whisperer-42

---

## Setup Status

| Task | Status |
|---|---|
| Google Places API key (Legacy + New) | ✅ Configured |
| Yelp Fusion API key (Base tier) | ✅ Saved — needs paid tier to activate |
| Vite proxy for Google Places Legacy | ✅ Working |
| Vite proxy for Google Places New | ✅ Working |
| Vite proxy for Yelp | ✅ Configured — blocked by Base tier |
| Lovable prototype scaffold | ✅ Generated |
| Claude Code skills installed | ✅ 19 skills |

## Still Needed

| Task | Status |
|---|---|
| OpenAI API key | ⬜ platform.openai.com |
| Supabase project setup | ⬜ When moving to real backend |
| Yelp paid tier (for cuisine/price fallback) | ⬜ Optional — name keywords cover most cases |
| Vercel hosting | ⬜ TBD |
| Domain (tasterra.com or variation) | ⬜ Check availability |
| Apple Developer account ($99/yr) | ⬜ For App Store |
| Google Play account ($25 one-time) | ⬜ For Play Store |

---

## Where We Left Off (April 7, 2026)

Restaurant search on onboarding step 4 is fully working:
- Autocomplete dropdown shows suggestions
- Selected restaurant cards show photo, cuisine label, and price range
- Cuisine resolved via Google `primaryType` + name keyword fallback
- Price resolved via Google `priceLevel` (Yelp fallback coded but needs paid tier)
- Navbar hidden on onboarding and auth pages

**Next logical steps:**
1. Continue refining the Discover page — make it feel more premium and personalized
2. Connect real GPT-4o API for actual AI chat responses
3. Connect Supabase for real data persistence
4. Eventually: deploy to Vercel

---

## CLAUDE CODE LIFELINE — Skills Inventory

| Skill | Purpose |
|---|---|
| docx | Create/edit Word documents |
| composio | Connect to external apps via Composio CLI |
| connect-apps-plugin | Real actions in 500+ apps (Gmail, Slack, GitHub, etc.) |
| firecrawl | Web scraping + browser automation |
| firecrawl-agent | Structured data extraction from websites |
| firecrawl-browser | Cloud browser automation |
| firecrawl-crawl | Bulk extract entire websites |
| firecrawl-download | Download websites as local files |
| firecrawl-map | Discover all URLs on a website |
| firecrawl-scrape | Extract clean markdown from any URL |
| firecrawl-search | Web search with full page content |
| frontend-design | Design system + bold UI decisions |
| web-artifacts-builder | Build React/Tailwind/shadcn artifacts |
| webapp-testing | Playwright UI testing |
| claude-api | Build apps with Claude/Anthropic SDK |
| find-internships | Search Summer 2026 internships for Jack |
| changelog-generator | Auto-generate changelogs from git commits |
| git-worktree-manager | Safely manage isolated git worktrees |
| sql-database-assistant | SQL queries + Supabase database help |
| api-design-reviewer | Review REST API design |
