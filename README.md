# srohrer.dev

Personal site for Sam Rohrer. Next.js 16 + Tailwind v4, deployed on Vercel.

Two candidate layouts render the same content from [`src/content/profile.ts`](src/content/profile.ts):

- `/`: **Showcase.** A scrolling page where each project shows a live, animated miniature instead of a screenshot.
- `/canvas`: **Canvas.** The whole site is a pan/zoom board with draggable cards, a minimap and keyboard shortcuts. It falls back to a list view on phones.

The previews (`src/components/previews`) are self-contained scripted animations. They pause when offscreen and settle on their final frame when the visitor prefers reduced motion.

```bash
npm install
npm run dev
```

To update content, edit `src/content/profile.ts`. Items marked `TODO` are placeholders.
