import type { PreviewKind } from "@/content/profile";
import { ReceiptsPreview } from "./ReceiptsPreview";
import { TracePreview } from "./TracePreview";
import { VideoPreview } from "./VideoPreview";

export function ProjectPreview({ kind, className, loomUrl }: { kind: PreviewKind; className?: string; loomUrl?: string }) {
  switch (kind) {
    case "receipts":
      return <ReceiptsPreview className={className} />;
    case "trace":
      return <TracePreview className={className} />;
    case "video":
      return <VideoPreview className={className} loomUrl={loomUrl} />;
  }
}
