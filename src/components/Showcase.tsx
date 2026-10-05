"use client";

import clsx from "clsx";
import { ProjectPreview } from "@/components/previews";
import { Check, Move } from "lucide-react";
import { ContactLinks, ExperienceList, ProjectActions, SkillsGrid, StatusBadge, Tags } from "@/components/shared";
import { profile, projects } from "@/content/profile";

function Nav({ onCanvas }: { onCanvas?: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5 text-sm">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent font-mono text-xs text-bg">sr</span>
          srohrer.dev
        </a>
        <div className="ml-auto flex items-center gap-5 text-muted">
          <a href="#work" className="hover:text-text">Work</a>
          <a href="#experience" className="hidden hover:text-text sm:inline">Experience</a>
          <a href="#contact" className="hover:text-text">Contact</a>
          {onCanvas && (
            <button onClick={onCanvas} className="hidden items-center gap-1.5 hover:text-text md:inline-flex">
              <Move className="size-3.5" /> Canvas view
            </button>
          )}
          <a href={profile.links.resume} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-text hover:border-faint">
            Résumé
          </a>
        </div>
      </nav>
    </header>
  );
}

/** The scrolling layout: the whole site on phones, and an opt-in list view on desktop. */
export function Showcase({ onCanvas }: { onCanvas?: () => void }) {
  return (
    <>
      <Nav onCanvas={onCanvas} />
      <main id="top" className="mx-auto max-w-6xl px-5">
        <section className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-y-0 -left-5 -right-5 overflow-hidden">
            <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-accent/10 blur-[120px]" />
          </div>
          <p className="relative font-mono text-sm text-accent">{profile.role}</p>
          <h1 className="relative mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">{profile.name}</h1>
          <p className="relative mt-5 max-w-2xl text-xl text-balance text-text/90 sm:text-2xl">{profile.tagline}</p>
          <p className="relative mt-5 max-w-2xl leading-relaxed text-muted">{profile.about}</p>
          <p className="relative mt-4 text-sm text-faint">{profile.location}</p>
          <ContactLinks className="relative mt-8" />
        </section>

        <section id="work" className="scroll-mt-20 pb-12">
          <div className="mb-10 flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold tracking-wider text-faint uppercase">Selected work</h2>
            <span className="hidden text-xs text-faint sm:inline">previews are live: they animate as you scroll</span>
          </div>

          <div className="space-y-24">
            {projects.map((p, i) => (
              <article key={p.slug} className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
                <div className={clsx("min-w-0", i % 2 === 1 && "lg:order-2")}>
                  <ProjectPreview kind={p.preview} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-lg text-accent">{p.oneLiner}</p>
                  <p className="mt-4 leading-relaxed text-muted">{p.description}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-text/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-green" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Tags tags={p.tags} />
                  </div>
                  <div className="mt-6">
                    <ProjectActions project={p} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="grid scroll-mt-20 gap-12 border-t border-border py-20 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h2 className="mb-8 text-sm font-semibold tracking-wider text-faint uppercase">Experience</h2>
            <ExperienceList />
          </div>
          <div>
            <h2 className="mb-8 text-sm font-semibold tracking-wider text-faint uppercase">Toolbox</h2>
            <SkillsGrid />
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 border-t border-border py-20 pb-32 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Let&apos;s build something.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            I&apos;m looking for my next role at a product-minded team working with AI. The fastest way to reach me is
            email.
          </p>
          <a href={`mailto:${profile.email}`} className="mt-6 inline-block font-mono text-lg text-accent hover:underline">
            {profile.email}
          </a>
          <ContactLinks className="mt-8 justify-center" compact />
          <p className="mt-16 text-xs text-faint">© {new Date().getFullYear()} {profile.name}</p>
        </section>
      </main>
    </>
  );
}
