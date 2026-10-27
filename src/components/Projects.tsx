import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { projects, type Project, type ProjectLink } from '../data/projects';
import GniVisual from './visuals/GniVisual';
import ForecastVisual from './visuals/ForecastVisual';
import RagVisual from './visuals/RagVisual';
import NutriVisual from './visuals/NutriVisual';

const visuals: Record<Project['visual'], () => React.JSX.Element> = {
  gni: GniVisual,
  forecast: ForecastVisual,
  rag: RagVisual,
  nutri: NutriVisual,
};

export default function Projects() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', containScroll: false, duration: 30 });
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const notify = (text: string) => setToast({ id: Date.now(), text });

  const sync = useCallback(() => {
    if (emblaApi) setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    sync();
    emblaApi.on('select', sync).on('reInit', sync);
    return () => {
      emblaApi.off('select', sync).off('reInit', sync);
    };
  }, [emblaApi, sync]);

  const go = (i: number) => emblaApi?.scrollTo(Math.max(0, Math.min(projects.length - 1, i)));

  return (
    <section id="projects" className="page" aria-roledescription="carousel" aria-label="Projects">
      <div className="shell flex flex-wrap items-end justify-between gap-5 pb-7">
        <h2 className="section-title">Things I've built</h2>
        <div className="flex items-center gap-2.5">
          <ArrowButton label="Previous project" disabled={index === 0} onClick={() => go(index - 1)}>
            ←
          </ArrowButton>
          <span className="min-w-16 text-center font-mono text-[13px] text-muted" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <ArrowButton label="Next project" disabled={index === projects.length - 1} onClick={() => go(index + 1)}>
            →
          </ArrowButton>
        </div>
      </div>

      <div
        ref={emblaRef}
        className="cursor-grab overflow-hidden active:cursor-grabbing"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(index + 1);
          if (e.key === 'ArrowLeft') go(index - 1);
        }}
      >
        <div className="flex items-start gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} active={i === index} onToast={notify} />
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        {projects.map((p, i) => (
          <button key={p.id} aria-label={`Go to ${p.name}`} onClick={() => go(i)} className="group grid size-8 place-items-center">
            <span
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-[26px] bg-fg' : 'w-2 bg-line group-hover:bg-muted'}`}
            />
          </button>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4" aria-live="polite">
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="toast pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 text-[14px] shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] backdrop-blur-md"
          >
            <span className="size-2 shrink-0 rounded-full bg-amber shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-amber)_25%,transparent)]" />
            <span>{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="ml-1 shrink-0 text-muted transition-colors hover:text-fg"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ArrowButton(props: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
      className="grid size-11 place-items-center rounded-full border border-line text-lg transition-colors enabled:hover:bg-surface2 disabled:opacity-30"
    >
      {props.children}
    </button>
  );
}

function ProjectCard({ project, active, onToast }: { project: Project; active: boolean; onToast: (text: string) => void }) {
  const Visual = visuals[project.visual];
  return (
    <article
      aria-roledescription="slide"
      aria-label={project.name}
      className={`@container relative min-w-0 shrink-0 grow-0 basis-[min(76rem,calc(100%-2.5rem))] select-none rounded-3xl border border-line bg-surface p-5 transition-[opacity,transform] duration-500 ease-out sm:p-8 ${
        active ? 'opacity-100' : 'scale-[0.965] opacity-40'
      }`}
    >
      <div className="grid gap-6 @3xl:gap-8 @3xl:grid-cols-[minmax(16rem,0.95fr)_1.4fr]">
        <div>
          <h3 className="mb-3 font-serif text-[1.75rem] leading-[1.1] text-balance sm:text-[2rem] font-medium tracking-[-0.01em]">{project.name}</h3>
          {project.paragraphs?.map((p) => (
            <p key={p} className="mb-3.5 text-[15px] text-fg/80">
              {p}
            </p>
          ))}
          {project.points && (
            <ul className="mb-4 list-disc space-y-1.5 pl-[1.1rem] text-sm text-fg/80">
              {project.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
          {project.badge && (
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12.5px]">
              <b className="font-semibold text-amber">{project.badge.strong}</b> {project.badge.text}
            </span>
          )}
          {project.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {project.links.map((l) => (
                <CardLink key={l.label} link={l} onToast={onToast} />
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="relative min-h-0 rounded-2xl border border-line bg-bg/60 p-3.5 sm:p-[18px]">
            <Visual />
          </div>
        </div>
      </div>
    </article>
  );
}

function CardLink({ link, onToast }: { link: ProjectLink; onToast: (text: string) => void }) {
  const external = /^https?:/.test(link.href);
  return (
    <a
      href={link.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className="border-b border-line pb-0.5 transition-colors hover:border-fg"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        if (!link.toast) return;
        e.preventDefault();
        onToast(link.toast);
      }}
    >
      {link.label} {link.toast ? '→' : '↗'}
    </a>
  );
}
