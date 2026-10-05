"use client";

import clsx from "clsx";
import { MousePointer2 } from "lucide-react";
import { Frame } from "./Frame";
import { useInView, useSequence } from "./useSequence";

type NodeId = "user" | "api" | "db" | "cache";
const LABELS: Record<NodeId, string> = { user: "Browser", api: "API", db: "Postgres", cache: "Redis" };

// positions in % of the board, before and after the agent runs layout()
const LOOSE: Record<NodeId, [number, number]> = { user: [14, 62], api: [42, 28], db: [74, 20], cache: [66, 74] };
const ALIGNED: Record<NodeId, [number, number]> = { user: [14, 50], api: [43, 50], db: [76, 30], cache: [76, 70] };

const ACTIONS: { call: string; nodes?: NodeId[]; edges?: [NodeId, NodeId][]; target: NodeId | "group"; layout?: boolean; group?: boolean }[] = [
  { call: 'add_node("Browser")', nodes: ["user"], target: "user" },
  { call: 'add_node("API")', nodes: ["api"], target: "api" },
  { call: 'add_node("Postgres")', nodes: ["db"], target: "db" },
  { call: "connect(Browser, API)", edges: [["user", "api"]], target: "api" },
  { call: "connect(API, Postgres)", edges: [["api", "db"]], target: "db" },
  { call: 'add_node("Redis")', nodes: ["cache"], target: "cache" },
  { call: "connect(API, Redis)", edges: [["api", "cache"]], target: "cache" },
  { call: 'layout("left-to-right")', layout: true, target: "api" },
  { call: 'group("Backend", [API, Postgres, Redis])', group: true, target: "group" },
];

const DURATIONS = [1200, ...ACTIONS.map((a) => (a.layout ? 1300 : a.group ? 1100 : 750)), 2600];

export function CanvasPreview({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useSequence(DURATIONS, inView);
  const done = ACTIONS.slice(0, Math.max(0, step)); // actions applied so far (step 0 = prompt only)

  const nodes = new Set(done.flatMap((a) => a.nodes ?? []));
  const edges = done.flatMap((a) => a.edges ?? []);
  const aligned = done.some((a) => a.layout);
  const grouped = done.some((a) => a.group);
  const pos = aligned ? ALIGNED : LOOSE;
  const current = step >= 1 && step <= ACTIONS.length ? ACTIONS[step - 1] : null;
  const cursor = current ? (current.target === "group" ? [60, 50] : pos[current.target]) : [50, 92];

  return (
    <Frame title="agent-canvas" className={clsx("h-[340px]", className)} frameRef={ref}>
      <div className="grid h-full grid-cols-1 sm:grid-cols-[1fr_170px]">
        <div className="grain relative overflow-hidden">
          <div className="absolute top-3 left-3 rounded-lg border border-border bg-panel/90 px-2.5 py-1.5 text-[11px] text-text backdrop-blur">
            <span className="text-faint">you · </span>sketch a simple web backend
          </div>

          {grouped && (
            <div
              className="fade-up absolute rounded-xl border border-dashed border-accent/60 bg-accent/5"
              style={{ left: "33%", top: "16%", width: "60%", height: "70%" }}
            >
              <span className="absolute -top-2.5 left-3 bg-bg px-1 text-[10px] text-accent">Backend</span>
            </div>
          )}

          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {edges.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={pos[a][0]}
                y1={pos[a][1]}
                x2={pos[b][0]}
                y2={pos[b][1]}
                stroke="var(--muted)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-1000"
              />
            ))}
          </svg>

          {(Object.keys(LABELS) as NodeId[]).map((id) =>
            nodes.has(id) ? (
              <div
                key={id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-1000 ease-in-out"
                style={{ left: `${pos[id][0]}%`, top: `${pos[id][1]}%` }}
              >
                <div
                  className={clsx(
                    "pop rounded-lg border bg-panel-2 px-3 py-2 text-[11px] font-medium whitespace-nowrap shadow-lg",
                    current?.target === id ? "border-blue/70" : "border-border",
                  )}
                >
                  {LABELS[id]}
                </div>
              </div>
            ) : null,
          )}

          <div
            className="pointer-events-none absolute z-10 transition-[left,top] duration-500 ease-out"
            style={{ left: `${cursor[0] + 3}%`, top: `${cursor[1] + 6}%` }}
          >
            <MousePointer2 className="size-4 fill-blue text-blue" />
            <span className="ml-3 rounded bg-blue px-1.5 py-px text-[9px] font-medium text-white">agent</span>
          </div>
        </div>

        <div className="hidden flex-col border-l border-border bg-panel-2/50 p-2.5 font-mono text-[9.5px] sm:flex">
          <span className="mb-2 text-[9px] tracking-wider text-faint uppercase">tool calls</span>
          <ol className="space-y-1">
            {done.map((a, i) => (
              <li
                key={a.call}
                className={clsx("fade-up truncate", i === done.length - 1 && step <= ACTIONS.length ? "text-blue" : "text-muted")}
              >
                {a.call}
              </li>
            ))}
          </ol>
          {step === DURATIONS.length - 1 && (
            <span className="fade-up mt-auto text-green">✓ 9 edits · undo restores any step</span>
          )}
        </div>
      </div>
    </Frame>
  );
}
