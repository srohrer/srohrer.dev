import clsx from "clsx";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { experience, profile, skills, type Project } from "@/content/profile";

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function ContactLinks({ className, compact }: { className?: string; compact?: boolean }) {
  const item = "inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted transition-colors hover:border-faint hover:text-text";
  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      <a className={item} href={profile.links.github} target="_blank" rel="noreferrer">
        <GitHubIcon className="size-4" /> {!compact && "GitHub"}
      </a>
      <a className={item} href={profile.links.linkedin} target="_blank" rel="noreferrer">
        <LinkedInIcon className="size-4" /> {!compact && "LinkedIn"}
      </a>
      <a className={item} href={`mailto:${profile.email}`}>
        <Mail className="size-4" /> {!compact && "Email"}
      </a>
      <a className={clsx(item, "border-accent/40 text-accent hover:border-accent hover:text-accent")} href={profile.links.resume} target="_blank" rel="noreferrer">
        <FileText className="size-4" /> Résumé
      </a>
    </div>
  );
}

export function StatusBadge({ status }: { status: Project["status"] }) {
  return status === "live" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2 py-0.5 text-[11px] font-medium text-green">
      <span className="size-1.5 rounded-full bg-green" /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-2 py-0.5 text-[11px] font-medium text-amber">
      <span className="size-1.5 animate-pulse rounded-full bg-amber" /> Building
    </span>
  );
}

export function ProjectActions({ project }: { project: Project }) {
  const btn = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap gap-2">
      {project.url ? (
        <a href={project.url} target="_blank" rel="noreferrer" className={clsx(btn, "bg-text text-bg hover:bg-white")}>
          Open app <ArrowUpRight className="size-3.5" />
        </a>
      ) : (
        <span className={clsx(btn, "cursor-default border border-border text-faint")}>Demo soon</span>
      )}
      {project.repo && (
        <a href={project.repo} target="_blank" rel="noreferrer" className={clsx(btn, "border border-border text-muted hover:text-text")}>
          <GitHubIcon className="size-3.5" /> Source
        </a>
      )}
    </div>
  );
}

export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t} className="rounded-md bg-panel-2 px-2 py-0.5 font-mono text-[11px] text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ExperienceList({ dense }: { dense?: boolean }) {
  return (
    <ol className={clsx("relative space-y-6 border-l border-border pl-5", dense && "space-y-4")}>
      {experience.map((e) => (
        <li key={e.company} className="relative">
          <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-bg bg-faint" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="font-medium">
              {e.company} <span className="font-normal text-muted">· {e.role}</span>
            </h3>
            <span className="font-mono text-xs text-faint">{e.period}</span>
          </div>
          {e.points.length > 0 && (
            <ul className={clsx("mt-2 space-y-1 text-sm text-muted", dense && "text-[13px]")}>
              {e.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-faint" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

export function SkillsGrid() {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
      {skills.map((s) => (
        <div key={s.group}>
          <dt className="mb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">{s.group}</dt>
          <dd className="text-sm text-muted">{s.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Temporary: lets you flip between the two candidate layouts. Delete once one is chosen. */
export function LayoutSwitcher({ current }: { current: "showcase" | "canvas" }) {
  const cls = (on: boolean) =>
    clsx("rounded-full px-3 py-1 transition-colors", on ? "bg-text text-bg" : "text-muted hover:text-text");
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-panel/90 p-1 text-xs shadow-2xl backdrop-blur">
      <span className="px-2 text-faint">Layout</span>
      <Link href="/" className={cls(current === "showcase")}>
        Showcase
      </Link>
      <Link href="/canvas" className={cls(current === "canvas")}>
        Canvas
      </Link>
    </div>
  );
}
