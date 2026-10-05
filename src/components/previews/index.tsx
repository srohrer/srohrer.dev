import type { PreviewKind } from "@/content/profile";
import { CanvasPreview } from "./CanvasPreview";
import { ReceiptsPreview } from "./ReceiptsPreview";
import { TracePreview } from "./TracePreview";
import { VideoPreview } from "./VideoPreview";

export function ProjectPreview({ kind, className }: { kind: PreviewKind; className?: string }) {
  switch (kind) {
    case "receipts":
      return <ReceiptsPreview className={className} />;
    case "canvas":
      return <CanvasPreview className={className} />;
    case "trace":
      return <TracePreview className={className} />;
    case "video":
      return <VideoPreview className={className} />;
  }
}
