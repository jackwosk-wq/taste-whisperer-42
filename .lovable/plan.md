

# Convert City Selector to Dropdown Menu

## What changes
Replace the horizontal pill bar city selector in the Navbar with a hover-activated dropdown menu. The currently selected city is shown as a button; hovering reveals a vertical list of other cities.

## Implementation

### Edit `src/components/Navbar.tsx`

**Desktop city selector (line 62-76):** Replace the horizontal `div` with a relative-positioned container that uses hover to show/hide a dropdown:

- **Trigger**: A button showing `MapPin` icon + selected city name, styled with the existing muted pill look
- **Dropdown**: An absolute-positioned vertical list that appears on hover (`group` + `group-hover:block` pattern or a small state toggle). Contains all cities except the selected one, each as a clickable row
- Use Tailwind `group`/`group-hover:` classes for pure CSS hover behavior (no extra state needed)
- Dropdown styled with `bg-popover border rounded-lg shadow-lg` to match the app's design tokens
- Each city option gets hover highlight (`hover:bg-muted`)

**Mobile menu (line ~120-135):** Keep the existing city pills in the mobile menu — no changes needed there.

### No new files or dependencies needed

Uses existing `MapPin` icon import and Tailwind utilities only.

