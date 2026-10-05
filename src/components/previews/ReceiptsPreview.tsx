"use client";

import clsx from "clsx";
import { Check, X } from "lucide-react";
import { Frame } from "./Frame";
import { useInView, useSequence } from "./useSequence";

// Real numbers from the Receipts coffee-sales sample: average revenue per day.
const STORES = [
  { name: "Airport", weekday: 2618, weekend: 2599 },
  { name: "Campus", weekday: 1880, weekend: 1279 },
  { name: "Downtown", weekday: 2534, weekend: 1267 },
  { name: "Riverside", weekday: 1108, weekend: 2202 },
];
const MAX = 2700;

const DURATIONS = [1100, 700, 900, 900, 450, 800, 450, 450, 1100, 2800];
const STAGES = ["Plan", "Execute", "Narrate", "Verify", "Repair"];

type ClaimState = "pending" | "ok" | "bad";

function Claim({ state, children, hot }: { state: ClaimState; children: React.ReactNode; hot?: boolean }) {
  return (
    <span
      className={clsx(
        "rounded-sm px-0.5 underline decoration-2 underline-offset-4 transition-colors duration-300",
        state === "pending" && "decoration-faint/50",
        state === "ok" && "decoration-green/60",
        state === "bad" && "bg-red/10 decoration-red/80",
        hot && "bg-blue/15",
      )}
    >
      {children}
      {state !== "pending" && (
        <sup className="pop ml-0.5 inline-flex">
          {state === "ok" ? (
            <Check className="size-2.5 text-green" strokeWidth={3.5} />
          ) : (
            <X className="size-2.5 text-red" strokeWidth={3.5} />
          )}
        </sup>
      )}
    </span>
  );
}

export function ReceiptsPreview({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useSequence(DURATIONS, inView);

  // 0 ask · 1 plan · 2 execute · 3 narrate · 4-7 verify · 8 repair · 9 done
  const stageIndex = step === 0 ? -1 : step <= 3 ? step - 1 : step <= 7 ? 3 : 4;
  const bars = step >= 2;
  const prose = step >= 3;
  const c1: ClaimState = step >= 4 ? "ok" : "pending";
  const c2: ClaimState = step >= 8 ? "ok" : step >= 5 ? "bad" : "pending";
  const c3: ClaimState = step >= 6 ? "ok" : "pending";
  const c4: ClaimState = step >= 7 ? "ok" : "pending";
  const repaired = step >= 8;
  const focusRiverside = step === 5 || step === 8;

  return (
    <Frame title="receipts.srohrer.dev" className={clsx("h-auto sm:h-[340px]", className)} frameRef={ref}>
      <div className="flex h-full flex-col gap-3 p-4 text-[11px]">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-lg bg-panel-2 px-2.5 py-1.5 font-medium text-text">
            Which store depends most on weekend sales?
          </span>
          {step === 9 && (
            <span className="pop shrink-0 rounded-full bg-green/15 px-2 py-0.5 font-mono text-[10px] text-green">
              4/4 verified
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {STAGES.map((s, i) => (
            <span
              key={s}
              className={clsx(
                "rounded-full border px-2 py-0.5 text-[10px] transition-colors duration-300",
                i < stageIndex || step === 9
                  ? "border-border text-muted"
                  : i === stageIndex
                    ? "border-blue/60 bg-blue/10 text-text"
                    : "border-border/50 text-faint",
                s === "Repair" && step < 8 && step > 0 && "opacity-60",
              )}
            >
              {(i < stageIndex || step === 9) && "✓ "}
              {s}
            </span>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-[1fr_1.15fr] sm:gap-4">
          <div className="flex h-36 items-end gap-2 border-b border-l border-border px-2 pb-0 sm:h-auto">
            {STORES.map((s, i) => {
              const dim = focusRiverside && s.name !== "Riverside";
              return (
                <div key={s.name} className="flex h-full flex-1 flex-col justify-end">
                  <div className={clsx("flex h-full items-end justify-center gap-0.5 transition-opacity", dim && "opacity-25")}>
                    {(["weekday", "weekend"] as const).map((k) => (
                      <div
                        key={k}
                        className={clsx("w-2.5 rounded-t-sm transition-[height] duration-700 ease-out", k === "weekday" ? "bg-blue/80" : "bg-accent/90")}
                        style={{ height: bars ? `${(s[k] / MAX) * 100}%` : "0%", transitionDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                  <span className="mt-1 -mb-4 truncate text-center text-[9px] text-faint">{s.name}</span>
                </div>
              );
            })}
          </div>

          <p className={clsx("leading-[1.9] text-text/90 transition-opacity duration-500", prose ? "opacity-100" : "opacity-0")}>
            Riverside is the weekend store: <Claim state={c1}>~$2,200 per weekend day</Claim>,{" "}
            <Claim state={c2} hot={focusRiverside}>
              {repaired ? "2.0x" : "1.8x"} a typical weekday
            </Claim>
            . Downtown is the reverse, where <Claim state={c3}>weekends earn about half</Claim>, and{" "}
            <Claim state={c4}>Airport is flat all week</Claim>.
            {step >= 5 && step < 8 && (
              <span className="fade-up mt-1 block font-mono text-[10px] text-red">
                ✗ stated 1.8x · actual 1.99x → sending back for repair
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3 text-[9px] text-faint">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-blue/80" /> weekday
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-accent/90" /> weekend
          </span>
        </div>
      </div>
    </Frame>
  );
}
