"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { Frame } from "./Frame";
import { useInView, useReducedMotion } from "./useSequence";

interface Span {
  name: string;
  kind: "run" | "llm" | "tool";
  start: number;
  end: number;
  depth: number;
  tokens?: number;
  error?: boolean;
}

const SPANS: Span[] = [
  { name: "agent.run  fix failing test", kind: "run", start: 0, end: 9.2, depth: 0 },
  { name: "llm  plan", kind: "llm", start: 0.1, end: 1.5, depth: 1, tokens: 1240 },
  { name: "tool  search_code", kind: "tool", start: 1.6, end: 2.4, depth: 1 },
  { name: "tool  read_file", kind: "tool", start: 2.5, end: 2.9, depth: 1 },
  { name: "llm  write_patch", kind: "llm", start: 3.0, end: 5.0, depth: 1, tokens: 2810 },
  { name: "tool  run_tests", kind: "tool", start: 5.1, end: 6.3, depth: 1, error: true },
  { name: "llm  fix_patch", kind: "llm", start: 6.4, end: 7.6, depth: 1, tokens: 1630 },
  { name: "tool  run_tests", kind: "tool", start: 7.7, end: 9.0, depth: 1 },
];
const TOTAL = 9.4;
const HOLD = 2.6;

function useClock(active: boolean): number {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => (v + dt > TOTAL + HOLD ? 0 : v + dt));
    }, 50);
    return () => clearInterval(id);
  }, [active, reduced]);
  return reduced ? TOTAL : t;
}

export function TracePreview({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const t = useClock(inView);
  const finished = SPANS.filter((s) => s.end <= t);
  const tokens = finished.reduce((n, s) => n + (s.tokens ?? 0), 0);
  const cost = (tokens / 1e6) * 0.9;

  return (
    <Frame title="tracer · run 4f2c" className={clsx("h-[340px]", className)} frameRef={ref}>
      <div className="flex h-full flex-col p-4 text-[11px]">
        <div className="mb-3 grid grid-cols-4 gap-2 font-mono text-[10px]">
          {[
            ["elapsed", `${Math.min(t, TOTAL - 0.2).toFixed(1)}s`],
            ["spans", `${SPANS.filter((s) => s.start <= t).length}/${SPANS.length}`],
            ["tokens", tokens.toLocaleString()],
            ["cost", `$${cost.toFixed(4)}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md border border-border bg-panel-2/60 px-2 py-1.5">
              <div className="text-[9px] text-faint uppercase">{k}</div>
              <div className="text-text tabular-nums">{v}</div>
            </div>
          ))}
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 grid grid-cols-[96px_1fr] sm:grid-cols-[150px_1fr]">
            <div />
            <div className="relative">
              {[0, 2, 4, 6, 8].map((s) => (
                <div key={s} className="absolute top-0 bottom-0 border-l border-border/60" style={{ left: `${(s / TOTAL) * 100}%` }}>
                  <span className="absolute -top-0.5 left-1 font-mono text-[8px] text-faint">{s}s</span>
                </div>
              ))}
              <div
                className="absolute top-0 bottom-0 w-px bg-accent/80"
                style={{ left: `${(Math.min(t, TOTAL) / TOTAL) * 100}%` }}
              />
            </div>
          </div>

          <ol className="relative space-y-1.5 pt-4">
            {SPANS.map((s, i) => {
              const started = t >= s.start;
              const w = Math.max(0, Math.min(t, s.end) - s.start);
              const running = started && t < s.end;
              return (
                <li key={i} className="grid grid-cols-[96px_1fr] sm:grid-cols-[150px_1fr] items-center gap-0">
                  <span
                    className={clsx("truncate font-mono text-[10px]", started ? "text-muted" : "text-faint/50", s.error && t >= s.end && "text-red")}
                    style={{ paddingLeft: s.depth * 10 }}
                  >
                    {s.name}
                  </span>
                  <div className="relative h-3.5">
                    <div
                      className={clsx(
                        "absolute h-full rounded-sm",
                        s.kind === "run" && "bg-faint/40",
                        s.kind === "llm" && "bg-blue/80",
                        s.kind === "tool" && (s.error && t >= s.end ? "bg-red/80" : "bg-amber/80"),
                        running && "animate-pulse",
                      )}
                      style={{ left: `${(s.start / TOTAL) * 100}%`, width: `${(w / TOTAL) * 100}%` }}
                    />
                    {s.tokens && t >= s.end && (
                      <span
                        className="fade-up absolute top-1/2 -translate-y-1/2 pl-1 font-mono text-[8.5px] text-faint"
                        style={{ left: `${(s.end / TOTAL) * 100}%` }}
                      >
                        {(s.tokens / 1000).toFixed(1)}k
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-2 flex gap-3 text-[9px] text-faint">
          <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue/80" /> model</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-amber/80" /> tool</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red/80" /> failed</span>
        </div>
      </div>
    </Frame>
  );
}
