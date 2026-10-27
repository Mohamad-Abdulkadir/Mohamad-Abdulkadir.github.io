import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { experience, type Experience as Role } from '../data/experience';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ *
 * Geometry
 *
 * The line runs left → right along the top of the first role, rounds the
 * right edge, runs right → left along the second, and so on. On narrow
 * screens it becomes a single vertical line down the left edge.
 * ------------------------------------------------------------------ */

interface RowGeo {
  y: number; // y of this role's horizontal run
  h: number; // row height
  L0: number; // path length at the start of this role
  run: number; // length of the straight run
  conn: number; // length of the connector down to the next role
  xs: number; // x where this run starts
}

interface Geo {
  W: number;
  H: number;
  narrow: boolean;
  xL: number;
  xR: number;
  d: string;
  L: number;
  rows: RowGeo[];
  pageTop: number; // track's top edge in page coordinates
}

const RADIUS = 44;

function quadLength(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) {
  let len = 0;
  let px = x0;
  let py = y0;
  const N = 24;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const u = 1 - t;
    const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
    const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len;
}

function buildGeo(track: HTMLElement, rowEls: HTMLElement[]): Geo | null {
  if (!rowEls.length) return null;
  const W = track.clientWidth;
  const H = track.scrollHeight;
  // Same breakpoint as the Tailwind `md:` padding on the rows, so the line and the text always agree.
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  const xL = narrow ? 14 : 30;
  const xR = W - 30;
  const r = narrow ? 0 : RADIUS;
  const ys = rowEls.map((el) => el.offsetTop + (narrow ? 56 : 40));

  let d = `M ${xL} ${ys[0]}`;
  let L = 0;
  let x = xL;
  const rows: RowGeo[] = ys.map((y, i) => {
    const last = i === ys.length - 1;
    const dir = i % 2 ? -1 : 1;
    const row: RowGeo = { y, h: rowEls[i].offsetHeight, L0: L, run: 0, conn: 0, xs: x };

    if (narrow) {
      const yEnd = last ? y + row.h * 0.75 : ys[i + 1];
      row.run = yEnd - y;
      d += ` V ${yEnd}`;
    } else {
      const xe = dir > 0 ? xR : xL;
      const runEnd = last ? xe : xe - dir * r;
      row.run = Math.abs(runEnd - x);
      d += ` H ${runEnd}`;
      if (!last) {
        const yn = ys[i + 1];
        d += ` Q ${xe} ${y} ${xe} ${y + r} V ${yn - r} Q ${xe} ${yn} ${xe - dir * r} ${yn}`;
        const q = quadLength(runEnd, y, xe, y, xe, y + r);
        row.conn = 2 * q + (yn - y - 2 * r);
        x = xe - dir * r;
      }
    }
    L += row.run + row.conn;
    return row;
  });

  const rect = track.getBoundingClientRect();
  return { W, H, narrow, xL, xR, d, L, rows, pageTop: rect.top + window.scrollY };
}

/** Maps a y position inside the track to a length along the line. */
function penToLength(g: Geo, pen: number) {
  const { rows } = g;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const last = i === rows.length - 1;
    const start = row.y - 30;
    const span = last ? row.h * 0.5 : rows[i + 1].y - row.y;
    if (pen < start) return i === 0 ? 0 : row.L0;
    const f = (pen - start) / span;
    if (f >= 1 && !last) continue;
    const ff = Math.min(1, f);
    const split = g.narrow || last ? 1 : 0.74;
    if (ff < split) return row.L0 + (ff / split) * row.run;
    if (split >= 1) return row.L0 + row.run; // last row has no connector
    return row.L0 + row.run + ((ff - split) / (1 - split)) * row.conn;
  }
  return g.L;
}

/* ------------------------------------------------------------------ */

export default function Experience() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const mainRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const marks = useRef(new Map<string, { el: SVGElement; at: number }>());

  const [geo, setGeo] = useState<Geo | null>(null);
  const [reached, setReached] = useState(-1);

  // Measure layout, and re-measure whenever the track changes size.
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setGeo(buildGeo(track, rowRefs.current.filter(Boolean) as HTMLElement[]));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const spring = useSpring(0, { stiffness: 90, damping: 26, mass: 0.5 });

  const paint = useCallback(
    (v: number) => {
      if (!geo || !mainRef.current || !headRef.current) return;
      if (!Number.isFinite(v)) return;
      const L = geo.L;
      const len = Math.max(0, Math.min(L, v));
      mainRef.current.style.strokeDashoffset = String(L - len);

      const p = mainRef.current.getPointAtLength(len);
      headRef.current.setAttribute('cx', String(p.x));
      headRef.current.setAttribute('cy', String(p.y));
      let idx = -1;
      geo.rows.forEach((row, i) => {
        if (len >= row.L0 - 1) idx = i;
      });
      headRef.current.setAttribute('fill', experience[Math.max(0, idx)].color);
      headRef.current.style.opacity = len > 1 && len < L - 1 ? '1' : '0';

      marks.current.forEach(({ el, at }) => {
        el.style.opacity = len >= at ? '1' : '0';
      });
      setReached(len > 0 ? idx : -1);
    },
    [geo],
  );

  useMotionValueEvent(spring, 'change', paint);

  // Scroll position → target length on the line.
  const { scrollY } = useScroll();
  const update = useCallback(() => {
    if (!geo) return;
    if (reduce) {
      spring.jump(geo.L);
      return;
    }
    const pen = scrollY.get() + window.innerHeight * 0.62 - geo.pageTop;
    spring.set(penToLength(geo, pen));
  }, [geo, reduce, scrollY, spring]);

  useMotionValueEvent(scrollY, 'change', update);
  useEffect(() => {
    update();
    paint(spring.get());
  }, [geo, update, paint, spring]);

  const mark = (key: string, at: number) => (el: SVGElement | null) => {
    if (el) marks.current.set(key, { el, at });
    else marks.current.delete(key);
  };

  return (
    <section id="experience" className="page shell">
      <div className="pb-5">
        <h2 className="section-title">Experience</h2>
      </div>

      <div ref={trackRef} className="relative">
        {geo && (
          <svg
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            viewBox={`0 0 ${geo.W} ${geo.H}`}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="exp-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.H}>
                {gradientStops(geo)}
              </linearGradient>
            </defs>

            {/* faint rail showing the whole route */}
            <path
              d={geo.d}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="2"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* the coloured line that draws as you scroll */}
            <path
              ref={mainRef}
              d={geo.d}
              fill="none"
              stroke="url(#exp-line)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={geo.L}
              strokeDashoffset={geo.L}
            />

            {experience.map((role, i) => {
              const row = geo.rows[i];
              const dir = i % 2 ? -1 : 1;
              const last = i === experience.length - 1;
              const startX = i === 0 ? geo.xL : row.xs;
              const endX = dir > 0 ? geo.xR : geo.xL;
              const labelStartX = i === 0 ? geo.xL : row.xs + (dir > 0 ? 14 : -14);
              const nodeX = geo.narrow ? geo.xL : startX;
              const endY = geo.narrow ? row.y + row.run : row.y;
              const endNodeX = geo.narrow ? geo.xL : endX;

              return (
                <g key={role.id}>
                  {!geo.narrow && (
                    <>
                      <text
                        ref={mark(`${role.id}-s`, row.L0)}
                        x={labelStartX}
                        y={row.y - 14}
                        textAnchor={dir > 0 ? 'start' : 'end'}
                        className="date-label"
                        style={{ opacity: 0 }}
                      >
                        {role.start}
                      </text>
                      <text
                        ref={mark(`${role.id}-e`, row.L0 + row.run - 2)}
                        x={endX}
                        y={row.y - 14}
                        textAnchor={dir > 0 ? 'end' : 'start'}
                        className="date-label"
                        style={{ opacity: 0 }}
                      >
                        {role.end}
                      </text>
                    </>
                  )}
                  <circle
                    ref={mark(`${role.id}-n`, row.L0)}
                    cx={nodeX}
                    cy={row.y}
                    r="5"
                    fill="var(--color-bg)"
                    stroke={role.color}
                    strokeWidth="2.5"
                    className="node"
                    style={{ opacity: 0 }}
                  />
                  {last && (
                    <g ref={mark('end', geo.L - 1)} className="node" style={{ opacity: 0 }}>
                      <circle cx={endNodeX} cy={endY} r="6" fill={role.color} className="ring" />
                      <circle cx={endNodeX} cy={endY} r="6" fill={role.color} />
                    </g>
                  )}
                </g>
              );
            })}

            {/* the point that travels along the line */}
            <circle
              ref={headRef}
              r="6"
              fill={experience[0].color}
              stroke="var(--color-bg)"
              strokeWidth="3"
              style={{ opacity: 0 }}
            />
          </svg>
        )}

        {experience.map((role, i) => (
          <article
            key={role.id}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="relative pb-14 pl-10 pt-8 md:px-[76px] md:pb-16 md:pt-[84px]"
            style={{ ['--c' as string]: role.color }}
          >
            <RoleCard role={role} on={Boolean(reduce) || i <= reached} flip={i % 2 === 1} />
          </article>
        ))}
      </div>
    </section>
  );
}

function gradientStops(geo: Geo) {
  const stops: { y: number; c: string }[] = [];
  experience.forEach((role, i) => {
    const y = geo.rows[i].y;
    const next = geo.rows[i + 1]?.y;
    if (geo.narrow) {
      // Solid per role, with a short blend just above each node.
      stops.push({ y: i ? y - 6 : 0, c: role.color });
      stops.push({ y: next !== undefined ? next - 34 : geo.H, c: role.color });
    } else {
      // Desktop: the colour holds along the run and blends around the corner.
      stops.push({ y: i ? y : 0, c: role.color });
      stops.push({ y: y + RADIUS, c: role.color });
    }
  });
  stops.push({ y: geo.H, c: experience[experience.length - 1].color });
  return stops.map((s, i) => (
    <stop key={i} offset={Math.max(0, Math.min(1, s.y / geo.H))} stopColor={s.c} />
  ));
}

function RoleCard({ role, on, flip }: { role: Role; on: boolean; flip: boolean }) {
  return (
    <motion.div
      className={`max-w-[46rem] ${flip ? 'md:ml-auto' : ''}`}
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 18 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        {(role.logo || role.mark) && (
        <div
          className={`grid h-12 shrink-0 place-items-center rounded-xl border text-center text-[11px] leading-tight font-bold tracking-wide sm:h-16 sm:rounded-2xl sm:text-[15px] ${
            role.logo ? (role.logoTall ? 'px-3 sm:px-4' : 'px-4 sm:px-5') : 'w-12 sm:w-16'
          }`}
          style={{
            color: role.color,
            background: `color-mix(in srgb, ${role.color} 14%, transparent)`,
            borderColor: `color-mix(in srgb, ${role.color} 40%, transparent)`,
          }}
        >
          {role.logo ? (
            <img
              src={role.logo}
              alt={role.org}
              className={`w-auto max-w-[9rem] object-contain ${role.logoTall ? 'h-8 sm:h-11' : 'h-5 sm:h-6'} ${role.logoInvert ? 'brightness-0 invert' : ''}`}
            />
          ) : (
            <span className="px-1">{role.mark}</span>
          )}
        </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-[1.3rem] leading-[1.15] font-medium tracking-[-0.01em] sm:text-[1.75rem]">
            {role.role}
          </h3>
          <p className="mt-1 text-[15px] text-fg/85 sm:text-base">{role.org}</p>
          <p className="mt-0.5 font-mono text-[12px] text-muted sm:text-[13px]">
            {role.start} – {role.end}
            <span className="block sm:inline"> <span className="hidden sm:inline">· </span>{role.location}</span>
          </p>
        </div>
      </div>

      {role.paragraphs.map((p) => (
        <p key={p} className="mb-3 text-[15px] leading-relaxed text-fg/85 sm:text-base">
          {p}
        </p>
      ))}

      {role.points && (
        <ul className="flex flex-col gap-2">
          {role.points.map((p) => (
            <li key={p} className="relative pl-5 text-[15px] leading-relaxed text-fg/85 sm:text-base">
              <span
                aria-hidden="true"
                className="absolute left-0.5 top-[0.7em] size-1.5 rounded-full"
                style={{ background: role.color }}
              />
              {p}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-4 flex flex-wrap gap-2">
        {role.tags.map((t) => (
          <li key={t} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
            {t}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
