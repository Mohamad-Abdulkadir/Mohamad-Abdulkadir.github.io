import { useState } from 'react';

const plots = [
  {
    id: 'fit',
    tab: 'Forecast fit',
    src: '/projects/power-fit.webp',
    w: 1250,
    h: 975,
    alt: 'Scatter of actual versus LightGBM-predicted day-ahead prices on the held-out window. Points hug the diagonal up to about 200 EUR/MWh; MAE 11.05, RMSE 21.21, correlation 0.92.',
    caption: 'LightGBM on the held-out window. Tight around normal prices, conservative on the rare spikes above 200 EUR/MWh.',
  },
  {
    id: 'drivers',
    tab: 'Price drivers',
    src: '/projects/power-drivers.webp',
    w: 1800,
    h: 724,
    alt: 'Two hexbin plots: day-ahead price rises with residual load, and falls toward zero and below as the renewable share of load grows.',
    caption: 'Residual load is the clearest scarcity signal; high renewable share pushes prices to zero and below.',
  },
  {
    id: 'tails',
    tab: 'Tail risk',
    src: '/projects/power-tails.webp',
    w: 1800,
    h: 634,
    alt: 'Two line charts: the chance of a price above 159.9 EUR/MWh climbs past 50% at the highest residual loads, and the chance of a negative price climbs to about 70% as renewables approach 100% of load.',
    caption: 'Extreme prices depend on system state: spike risk climbs with residual load, negative-price risk with renewables.',
  },
  {
    id: 'duration',
    tab: 'Price duration',
    src: '/projects/power-duration.webp',
    w: 1800,
    h: 634,
    alt: 'Price duration curve: a flat middle around the 87 EUR/MWh mean, with steep tails from -500 to 936 EUR/MWh.',
    caption: 'A stable middle with very steep tails: prices span -500 to 936 EUR/MWh, and 5.3% of hours are negative.',
  },
];

const stats = [
  ['13.65', 'EUR/MWh best walk-forward MAE'],
  ['11.05', 'EUR/MWh held-out MAE'],
  ['0.92', 'actual vs. predicted correlation'],
];

/** Real plots from the forecasting pipeline, one at a time behind tabs. */
export default function ForecastVisual() {
  const [active, setActive] = useState(0);
  const plot = plots[active];

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {stats.map(([v, l]) => (
          <div key={l} className="rounded-lg border border-line bg-surface px-2.5 py-2">
            <div className="font-serif text-[1.25rem] leading-none text-fg sm:text-[1.45rem]">{v}</div>
            <div className="mt-1 text-[10.5px] leading-snug text-muted sm:text-[11px]">{l}</div>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Forecasting plots" className="mb-2.5 flex gap-1 overflow-x-auto rounded-full border border-line p-1">
        {plots.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === active}
            aria-controls={`power-plot-${p.id}`}
            onClick={() => setActive(i)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] whitespace-nowrap transition-colors ${
              i === active ? 'bg-fg text-bg' : 'text-muted hover:text-fg'
            }`}
          >
            {p.tab}
          </button>
        ))}
      </div>

      <figure id={`power-plot-${plot.id}`} role="tabpanel">
        <div className="grid place-items-center overflow-hidden rounded-xl bg-white p-2 sm:p-3">
          <img
            key={plot.id}
            src={plot.src}
            width={plot.w}
            height={plot.h}
            alt={plot.alt}
            draggable={false}
            loading="lazy"
            className="max-h-[22rem] w-auto max-w-full animate-[fade_0.35s_ease-out] object-contain"
          />
        </div>
        <figcaption className="mt-2 text-[12.5px] leading-snug text-muted">{plot.caption}</figcaption>
      </figure>
    </div>
  );
}
