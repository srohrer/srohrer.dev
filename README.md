# srohrer.dev

Personal site for Sam Rohrer. Next.js 16 + Tailwind v4, deployed on Vercel.

The home page has two layouts, both rendered from [`src/content/profile.ts`](src/content/profile.ts):

- **Desktop (768px and up): Canvas.** The whole site is a pan/zoom board with draggable cards, a minimap and keyboard shortcuts. A "List view" button switches to the showcase.
- **Phones: Showcase.** A scrolling page where each project shows a live, animated miniature instead of a screenshot.

The split is done in CSS ([`Home.tsx`](src/components/Home.tsx)), so the server render matches and nothing flashes on load.

The previews (`src/components/previews`) are self-contained scripted animations. They pause when offscreen and settle on their final frame when the visitor prefers reduced motion.

```bash
npm install
npm run dev
```

To update content, edit `src/content/profile.ts`. Items marked `TODO` are placeholders.
