"use client";

import clsx from "clsx";
import { GripHorizontal, LayoutList, Maximize, Minus, Move, Plus, Spline } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ProjectPreview } from "@/components/previews";
import { ContactLinks, ExperienceList, LayoutSwitcher, ProjectActions, SkillsGrid, StatusBadge, Tags } from "@/components/shared";
import { profile, projects } from "@/content/profile";
import { bounds, createCameraStore, fitRect, type CameraStore, type Rect } from "./camera";

// ---------------------------------------------------------------------------
// Board content

interface CardDef {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  badge?: ReactNode;
  tone?: "default" | "note";
  rotate?: number;
  body: ReactNode;
}

function ProjectBody({ p }: { p: (typeof projects)[number] }) {
  return (
    <div className="space-y-4">
      <ProjectPreview kind={p.preview} className="h-[300px]" />
      <div>
        <p className="text-lg font-medium text-accent">{p.oneLiner}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
      </div>
      <Tags tags={p.tags} />
      <ProjectActions project={p} />
    </div>
  );
}

const PROJECT_SLOTS: [number, number][] = [
  [640, -560],
  [640, 220],
  [-1280, 220],
  [-1280, -560],
];

function buildCards(): CardDef[] {
  return [
    {
      id: "intro",
      title: "hello.md",
      x: -280,
      y: -170,
      w: 560,
      body: (
        <div>
          <p className="font-mono text-sm text-accent">{profile.role}</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="mt-4 text-xl text-balance text-text/90">{profile.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{profile.about}</p>
          <p className="mt-3 text-xs text-faint">{profile.location}</p>
          <ContactLinks className="mt-6" />
        </div>
      ),
    },
    ...projects.map((p, i): CardDef => ({
      id: p.slug,
      title: p.name,
      x: PROJECT_SLOTS[i % PROJECT_SLOTS.length][0],
      y: PROJECT_SLOTS[i % PROJECT_SLOTS.length][1],
      w: 640,
      badge: <StatusBadge status={p.status} />,
      body: <ProjectBody p={p} />,
    })),
    {
      id: "experience",
      title: "experience.log",
      x: -280,
      y: 400,
      w: 560,
      body: <ExperienceList dense />,
    },
    {
      id: "skills",
      title: "toolbox",
      x: -280,
      y: -560,
      w: 560,
      body: <SkillsGrid />,
    },
    {
      id: "note",
      title: "note",
      x: -640,
      y: -130,
      w: 250,
      tone: "note",
      rotate: -3,
      body: (
        <p className="text-sm leading-relaxed">
          This page is a canvas. Drag the background to pan, drag cards by their header, and pinch or{" "}
          <span className="font-mono text-xs">⌘/Ctrl + scroll</span> to zoom. Double-click a header to focus it.
        </p>
      ),
    },
  ];
}

const EDGES: [string, string][] = [
  ["intro", "skills"],
  ["intro", "experience"],
  ...projects.map((p): [string, string] => ["intro", p.slug]),
];

// ---------------------------------------------------------------------------
// Card

const Card = memo(function Card({
  def,
  pos,
  onDragStart,
  onFocus,
  measureRef,
}: {
  def: CardDef;
  pos: { x: number; y: number };
  onDragStart: (id: string, e: React.PointerEvent) => void;
  onFocus: (id: string) => void;
  measureRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const note = def.tone === "note";
  return (
    <div
      ref={(el) => measureRef(def.id, el)}
      data-card
      className={clsx(
        "absolute rounded-2xl border shadow-2xl shadow-black/50",
        note ? "border-amber/30 bg-[#2a2414] text-amber/90" : "border-border bg-panel",
      )}
      style={{ left: pos.x, top: pos.y, width: def.w, rotate: def.rotate ? `${def.rotate}deg` : undefined }}
    >
      <div
        onPointerDown={(e) => onDragStart(def.id, e)}
        onDoubleClick={() => onFocus(def.id)}
        className={clsx(
          "flex h-10 cursor-grab touch-none items-center gap-2 rounded-t-2xl border-b px-4 select-none active:cursor-grabbing",
          note ? "border-amber/20" : "border-border bg-panel-2/60",
        )}
      >
        <GripHorizontal className="size-3.5 text-faint" />
        <span className="font-mono text-xs text-muted">{def.title}</span>
        <span className="ml-auto">{def.badge}</span>
      </div>
      <div className="p-5">{def.body}</div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Widgets subscribed to the camera

function useCamera(store: CameraStore) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

function ZoomLabel({ store }: { store: CameraStore }) {
  const cam = useCamera(store);
  return <span className="w-12 text-center font-mono text-xs text-muted tabular-nums">{Math.round(cam.z * 100)}%</span>;
}

function Minimap({
  store,
  rects,
  viewport,
}: {
  store: CameraStore;
  rects: (Rect & { id: string })[];
  viewport: { w: number; h: number };
}) {
  const cam = useCamera(store);
  if (!rects.length || !viewport.w) return null;
  const view: Rect = { x: -cam.x / cam.z, y: -cam.y / cam.z, w: viewport.w / cam.z, h: viewport.h / cam.z };
  const b = bounds([...rects, view]);
  const W = 180;
  const H = 120;
  const s = Math.min(W / b.w, H / b.h);
  const ox = (W - b.w * s) / 2 - b.x * s;
  const oy = (H - b.h * s) / 2 - b.y * s;
  return (
    <svg
      width={W}
      height={H}
      className="cursor-pointer rounded-xl border border-border bg-panel/90 backdrop-blur"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const wx = (e.clientX - r.left - ox) / s;
        const wy = (e.clientY - r.top - oy) / s;
        store.animateTo({ z: cam.z, x: viewport.w / 2 - wx * cam.z, y: viewport.h / 2 - wy * cam.z });
      }}
    >
      {rects.map((r) => (
        <rect
          key={r.id}
          x={ox + r.x * s}
          y={oy + r.y * s}
          width={r.w * s}
          height={r.h * s}
          rx={2}
          fill={r.id === "note" ? "#fbbf2455" : r.id === "intro" ? "#ff7a5966" : "#9a9fab40"}
        />
      ))}
      <rect
        x={ox + view.x * s}
        y={oy + view.y * s}
        width={view.w * s}
        height={view.h * s}
        fill="none"
        stroke="#ecedf0"
        strokeOpacity={0.7}
        strokeWidth={1}
        rx={2}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------

const narrowQuery = "(max-width: 767px)";
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(narrowQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia(narrowQuery).matches,
    () => false,
  );
}

export function CanvasBoard() {
  const cards = useMemo(() => buildCards(), []);
  const narrow = useNarrow();
  const [override, setOverride] = useState<"canvas" | "list" | null>(null);
  const mode = override ?? (narrow ? "list" : "canvas");

  return mode === "canvas" ? (
    <Board cards={cards} onList={() => setOverride("list")} />
  ) : (
    <ListView cards={cards} onCanvas={() => setOverride("canvas")} />
  );
}

function Board({ cards, onList }: { cards: CardDef[]; onList: () => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [store] = useState(() => createCameraStore({ x: 0, y: 0, z: 1 }));
  const [positions, setPositions] = useState(() => Object.fromEntries(cards.map((c) => [c.id, { x: c.x, y: c.y }])));
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const observers = useRef(new Map<string, ResizeObserver>());

  const rects = useMemo(
    () =>
      cards
        .filter((c) => sizes[c.id])
        .map((c) => ({ id: c.id, x: positions[c.id].x, y: positions[c.id].y, w: sizes[c.id].w, h: sizes[c.id].h })),
    [cards, positions, sizes],
  );

  // Apply camera to the DOM without re-rendering React.
  useEffect(() => {
    const apply = () => {
      const { x, y, z } = store.get();
      if (worldRef.current) worldRef.current.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
      if (viewportRef.current) {
        viewportRef.current.style.backgroundSize = `${24 * z}px ${24 * z}px`;
        viewportRef.current.style.backgroundPosition = `${x}px ${y}px`;
      }
    };
    apply();
    return store.subscribe(apply);
  }, [store]);

  useEffect(() => {
    const el = viewportRef.current!;
    const ro = new ResizeObserver(() => setViewport({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measureRef = useCallback((id: string, el: HTMLDivElement | null) => {
    observers.current.get(id)?.disconnect();
    observers.current.delete(id);
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setSizes((s) =>
        s[id]?.w === el.offsetWidth && s[id]?.h === el.offsetHeight ? s : { ...s, [id]: { w: el.offsetWidth, h: el.offsetHeight } },
      ),
    );
    ro.observe(el);
    observers.current.set(id, ro);
  }, []);

  const fitAll = useCallback(
    (animate = true) => {
      if (!rects.length || !viewport.w) return;
      const target = fitRect(bounds(rects), viewport.w, viewport.h, 64, 1);
      if (animate) store.animateTo(target);
      else store.set(target);
    },
    [rects, viewport, store],
  );

  // First fit once every card has been measured.
  useEffect(() => {
    if (!ready && rects.length === cards.length && viewport.w) {
      const intro = rects.find((r) => r.id === "intro")!;
      const all = fitRect(bounds(rects), viewport.w, viewport.h, 64, 1);
      // Start a bit zoomed toward the intro so the name is readable, but show the layout.
      const z = Math.min(1, Math.max(all.z, 0.5));
      store.set({ z, x: viewport.w / 2 - (intro.x + intro.w / 2) * z, y: viewport.h / 2 - (intro.y + intro.h / 2) * z });
      requestAnimationFrame(() => setReady(true));
    }
  }, [ready, rects, cards.length, viewport, store]);

  const focusCard = useCallback(
    (id: string) => {
      const r = rects.find((x) => x.id === id);
      if (r) store.animateTo(fitRect(r, viewport.w, viewport.h, 40, 1.2));
    },
    [rects, viewport, store],
  );

  // --- pan / pinch on the background
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-card],[data-ui]")) return;
    store.stop();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = viewportRef.current!.getBoundingClientRect();
      store.zoomAt((a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top, dist / pinch.current.dist);
      pinch.current.dist = dist;
    } else if (pointers.current.size === 1) {
      const cam = store.get();
      store.set({ ...cam, x: cam.x + next.x - prev.x, y: cam.y + next.y - prev.y });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  // Wheel: scroll pans, ctrl/⌘ + scroll (and trackpad pinch) zooms — Figma conventions.
  useEffect(() => {
    const el = viewportRef.current!;
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-ui]")) return;
      e.preventDefault();
      store.stop();
      const rect = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        store.zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.01));
      } else {
        const cam = store.get();
        store.set({ ...cam, x: cam.x - e.deltaX, y: cam.y - e.deltaY });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [store]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,textarea")) return;
      const cx = viewport.w / 2;
      const cy = viewport.h / 2;
      const cam = store.get();
      if (e.key === "=" || e.key === "+") store.zoomAt(cx, cy, 1.2);
      else if (e.key === "-") store.zoomAt(cx, cy, 1 / 1.2);
      else if (e.key === "0") fitAll();
      else if (e.key.startsWith("Arrow")) {
        const d = 80;
        const dx = e.key === "ArrowLeft" ? d : e.key === "ArrowRight" ? -d : 0;
        const dy = e.key === "ArrowUp" ? d : e.key === "ArrowDown" ? -d : 0;
        store.animateTo({ ...cam, x: cam.x + dx, y: cam.y + dy }, 150);
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store, viewport, fitAll]);

  // --- card dragging
  const onDragStart = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      let last = { x: e.clientX, y: e.clientY };
      const move = (ev: PointerEvent) => {
        const z = store.get().z;
        const dx = (ev.clientX - last.x) / z;
        const dy = (ev.clientY - last.y) / z;
        last = { x: ev.clientX, y: ev.clientY };
        setPositions((p) => ({ ...p, [id]: { x: p[id].x + dx, y: p[id].y + dy } }));
      };
      const up = () => {
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerup", up);
        target.removeEventListener("pointercancel", up);
      };
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", up);
      target.addEventListener("pointercancel", up);
    },
    [store],
  );

  const center = (id: string) => {
    const r = rects.find((x) => x.id === id);
    return r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : null;
  };

  const btn = "flex size-8 items-center justify-center rounded-lg text-muted hover:bg-panel-2 hover:text-text";

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff14 1px, transparent 0)" }}
      >
        <div
          ref={worldRef}
          className={clsx("absolute top-0 left-0 origin-top-left transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}
        >
          <svg className="pointer-events-none absolute overflow-visible" width={1} height={1} aria-hidden>
            {EDGES.map(([a, b]) => {
              const p = center(a);
              const q = center(b);
              if (!p || !q) return null;
              const mx = (p.x + q.x) / 2;
              return (
                <path
                  key={`${a}-${b}`}
                  d={`M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`}
                  fill="none"
                  stroke="#ff7a59"
                  strokeOpacity={0.35}
                  strokeWidth={2}
                  strokeDasharray="6 8"
                />
              );
            })}
          </svg>
          {cards.map((c) => (
            <Card key={c.id} def={c} pos={positions[c.id]} onDragStart={onDragStart} onFocus={focusCard} measureRef={measureRef} />
          ))}
        </div>
      </div>

      <div data-ui className="absolute top-4 left-4 flex items-center gap-3 rounded-xl border border-border bg-panel/90 px-3 py-2 text-sm backdrop-blur">
        <span className="flex size-7 items-center justify-center rounded-lg bg-accent font-mono text-xs text-bg">sr</span>
        <span className="font-semibold tracking-tight">srohrer.dev</span>
        <span className="hidden items-center gap-1.5 text-xs text-faint lg:flex">
          <Move className="size-3" /> drag to pan · ⌘/Ctrl+scroll to zoom
        </span>
      </div>

      <div data-ui className="absolute top-4 right-4 flex gap-2">
        <button onClick={onList} className="flex items-center gap-1.5 rounded-xl border border-border bg-panel/90 px-3 py-2 text-sm text-muted backdrop-blur hover:text-text">
          <LayoutList className="size-4" /> List view
        </button>
      </div>

      <div data-ui className="absolute bottom-4 left-4 flex items-center gap-0.5 rounded-xl border border-border bg-panel/90 p-1 backdrop-blur">
        <button className={btn} aria-label="Zoom out" onClick={() => store.zoomAt(viewport.w / 2, viewport.h / 2, 1 / 1.25)}>
          <Minus className="size-4" />
        </button>
        <ZoomLabel store={store} />
        <button className={btn} aria-label="Zoom in" onClick={() => store.zoomAt(viewport.w / 2, viewport.h / 2, 1.25)}>
          <Plus className="size-4" />
        </button>
        <div className="mx-1 h-5 w-px bg-border" />
        <button className={btn} aria-label="Fit everything" title="Fit (0)" onClick={() => fitAll()}>
          <Maximize className="size-4" />
        </button>
        <button
          className={btn}
          aria-label="Reset layout"
          title="Reset card positions"
          onClick={() => setPositions(Object.fromEntries(cards.map((c) => [c.id, { x: c.x, y: c.y }])))}
        >
          <Spline className="size-4" />
        </button>
      </div>

      <div data-ui className="absolute right-4 bottom-4 hidden sm:block">
        <Minimap store={store} rects={rects} viewport={viewport} />
      </div>

      <LayoutSwitcher current="canvas" />
    </div>
  );
}

function ListView({ cards, onCanvas }: { cards: CardDef[]; onCanvas: () => void }) {
  const order = ["intro", ...projects.map((p) => p.slug), "experience", "skills"];
  const sorted = order.map((id) => cards.find((c) => c.id === id)!).filter(Boolean);
  return (
    <div className="grain min-h-dvh">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border/60 bg-bg/80 px-4 py-3 backdrop-blur">
        <Link href="/canvas" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent font-mono text-xs text-bg">sr</span>
          srohrer.dev
        </Link>
        <button
          onClick={onCanvas}
          className="ml-auto flex items-center gap-1.5 rounded-xl border border-border bg-panel px-3 py-1.5 text-sm text-muted hover:text-text"
        >
          <Move className="size-4" /> Canvas view
        </button>
      </header>
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6 pb-28">
        {sorted.map((c) => (
          <section key={c.id} className="overflow-hidden rounded-2xl border border-border bg-panel">
            <div className="flex h-10 items-center gap-2 border-b border-border bg-panel-2/60 px-4">
              <span className="font-mono text-xs text-muted">{c.title}</span>
              <span className="ml-auto">{c.badge}</span>
            </div>
            <div className="p-5">{c.body}</div>
          </section>
        ))}
      </main>
      <LayoutSwitcher current="canvas" />
    </div>
  );
}
