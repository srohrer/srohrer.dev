import clsx from "clsx";
import { ArrowRight, Play } from "lucide-react";

/**
 * TODO: placeholder for the Anki Bridge Loom walkthrough. Replace with the Loom
 * embed (<iframe src="https://www.loom.com/embed/<id>">) once it's recorded.
 */
export function VideoPreview({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "group relative flex h-[340px] items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#1a1530] via-panel to-[#10201c] shadow-2xl shadow-black/40",
        className,
      )}
    >
      {/* poster: a VN line becoming a flashcard */}
      <div className="absolute inset-0 flex items-center justify-center gap-5 opacity-60 transition-opacity group-hover:opacity-35">
        <div className="w-44 rounded-lg border border-white/10 bg-black/40 p-3 text-center">
          <div className="mb-2 h-16 rounded bg-gradient-to-b from-[#3b2d5c] to-[#1d1830]" />
          <p className="text-sm text-white/90">「もう少しだけ、待って」</p>
        </div>
        <ArrowRight className="size-5 text-white/40" />
        <div className="w-40 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <p className="text-center text-lg text-white">待つ</p>
          <p className="mt-1 text-center text-[11px] text-white/50">まつ · to wait</p>
          <div className="mt-3 flex justify-center gap-1.5">
            <span className="rounded bg-green/20 px-1.5 py-0.5 text-[9px] text-green">approve</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60">skip</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Play demo video (coming soon)"
        className="relative flex size-16 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition group-hover:scale-105"
      >
        <Play className="ml-1 size-6 fill-current" />
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 text-[11px]">
        <span className="font-medium text-white/90">Anki Bridge walkthrough</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/70">video coming soon</span>
      </div>
    </div>
  );
}
