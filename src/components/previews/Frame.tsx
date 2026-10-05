import clsx from "clsx";
import type { ReactNode, Ref } from "react";

/** Fake app-window chrome around each live preview. */
export function Frame({
  title,
  children,
  className,
  frameRef,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  frameRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={frameRef}
      className={clsx("flex flex-col overflow-hidden rounded-xl border border-border bg-panel shadow-2xl shadow-black/40", className)}
    >
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-border bg-panel-2 px-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/70" />
        <span className="size-2.5 rounded-full bg-[#28c840]/70" />
        <span className="ml-3 truncate font-mono text-[10px] text-faint">{title}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
