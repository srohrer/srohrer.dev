/**
 * Everything on the site comes from this file — both layouts render it.
 * Items marked TODO are placeholders to replace as projects ship.
 */

export type PreviewKind = "receipts" | "canvas" | "trace" | "video";

export interface Project {
  slug: string;
  name: string;
  oneLiner: string;
  description: string;
  status: "live" | "building";
  tags: string[];
  preview: PreviewKind;
  /** TODO: real URLs once deployed / public */
  url?: string;
  repo?: string;
  highlights: string[];
}

export const profile = {
  name: "Sam Rohrer",
  role: "Fullstack engineer",
  tagline: "I build complex React interfaces and the LLM systems behind them.",
  about:
    "12+ years shipping frontend-heavy products, 8 of them owning core systems in a large enterprise TypeScript/React app — the canvas, the charts, the query layer. Lately I build LLM applications that have to be right, not just plausible: tool-using agents, evaluation harnesses, and interfaces that show their work.",
  location: "Mountain View, CA · open to remote",
  email: "srohrer72@gmail.com",
  links: {
    github: "https://github.com/srohrer",
    linkedin: "https://www.linkedin.com/in/sam-rohrer-9816a077",
    resume: "/resume.pdf",
  },
};

export const projects: Project[] = [
  {
    slug: "receipts",
    name: "Receipts",
    oneLiner: "Data analysis where every claim is checked.",
    description:
      "Ask a CSV a question. An LLM plans the analysis and explains the results — and every number it states is independently re-derived from the data before you see it. Failed claims go back to the model with the true values.",
    status: "live",
    tags: ["Next.js", "React 19", "DeepSeek", "Zod", "TanStack Virtual"],
    preview: "receipts",
    url: "https://receipts.srohrer.dev",
    repo: "https://github.com/srohrer/receipts",
    highlights: [
      "Model writes queries in a typed DSL; a deterministic engine runs them in the browser",
      "Claims graded with rounding semantics, then auto-repaired",
      "Hover any claim to see the exact cells that prove it",
    ],
  },
  {
    slug: "canvas",
    name: "Agent Canvas",
    oneLiner: "A whiteboard you can delegate to.",
    description:
      "An infinite canvas where an AI agent edits the board through tool calls — add, connect, align, group — instead of generating pictures. Every agent move is a normal, undoable edit you can inspect and revert.",
    status: "building",
    tags: ["React", "Canvas", "Tool calling", "CRDT"],
    preview: "canvas",
    // TODO: url / repo
    highlights: [
      "Agent operates on the scene graph, not pixels",
      "Agent actions land in the same undo stack as yours",
      "Streaming tool calls animate onto the board as they arrive",
    ],
  },
  {
    slug: "trace",
    name: "Tracer",
    oneLiner: "See what your agent actually did.",
    description:
      "A live timeline for agent runs: every model call and tool call as a span, with latency, tokens and cost, retries and failures. Scrub, replay, and diff two runs side by side.",
    status: "building",
    tags: ["React", "Streaming", "OpenTelemetry", "Virtualization"],
    preview: "trace",
    // TODO: url / repo
    highlights: [
      "Waterfall of nested spans, streamed live",
      "Token and cost accounting per step",
      "Run-to-run diffing to catch regressions",
    ],
  },
  {
    slug: "anki-bridge",
    name: "Anki Bridge",
    oneLiner: "Screenshots in, flashcards out.",
    description:
      "An MCP server that turns Japanese visual-novel screenshots into flashcards, checking each candidate against your existing collection to skip duplicates. It's read-only by design: every new card goes through a local approval UI.",
    status: "live",
    tags: ["Python", "MCP", "Anki", "Vision"],
    preview: "video",
    // TODO: repo + Loom link
    highlights: [
      "Dedupes against the existing collection before proposing cards",
      "Per-card human approval — the model can't write directly",
      "Versioned card formats so stale cards resurface for regeneration",
    ],
  },
];

export const experience = [
  {
    company: "Centric Software",
    role: "Fullstack Developer",
    period: "2018 — now",
    points: [
      "Founded and led the Canvas team; turned an unstable inherited codebase into an extensible framework",
      "Cut a 3+ minute canvas save to ~10 s for 200+ enterprise customers",
      "Own the charts system and number localization end to end",
      "Core Frameworks: query system, data models, widget rendering",
    ],
  },
  {
    company: "2nfro",
    role: "Frontend Engineer",
    period: "2013 — 2017",
    points: ["Built a social network aggregator's web and mobile frontend end to end"],
  },
  {
    company: "Carnegie Mellon University",
    role: "BS, Mathematics",
    period: "2009 — 2013",
    points: [],
  },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "Python", "Go", "Java", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Canvas/SVG", "Data viz"] },
  { group: "AI / LLM", items: ["Agents & tool use", "Evals", "MCP", "Local models"] },
  { group: "Infra", items: ["Node", "Docker", "AWS", "Vercel"] },
];
