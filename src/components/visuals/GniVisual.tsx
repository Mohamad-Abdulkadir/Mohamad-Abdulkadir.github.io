const box = 'rounded-lg border border-line bg-surface px-2.5 py-2 text-center text-[12.5px] leading-tight';
const label = 'font-mono text-[9.5px] tracking-[0.14em] text-muted uppercase';

function Down({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1.5 text-muted" aria-hidden="true">
      <span className="text-[13px] leading-none">↓</span>
      {text && <span className={label}>{text}</span>}
    </div>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <div className="mt-0.5 text-[10.5px] text-muted">{children}</div>;
}

/** GNI architecture, drawn in HTML so it reflows from phone to desktop. */
export default function GniVisual() {
  return (
    <div
      role="img"
      aria-label="GNI architecture. Requests arrive from WhatsApp, the operator console, simulation or schedules, pass through the FastAPI control API, and run as durable Hatchet jobs. Inside a run, a LangGraph orchestrator delegates to research, communications, scheduling and analytics specialists, using memory and context budgets. Specialists use web research, document search, analytics and MCP connectors; external actions need owner approval. Underneath sit PostgreSQL with row-level security, R2 storage, OpenBao secrets, LiteLLM and Langfuse."
      className="text-fg"
    >
      <div className="grid grid-cols-2 gap-1.5 @lg:grid-cols-4">
        {[
          ['Owner', 'WhatsApp'],
          ['Operator', 'Console'],
          ['Simulation', 'dry-run writes'],
          ['Schedules', 'recurring runs'],
        ].map(([a, b]) => (
          <div key={a} className={box}>
            {a}
            <Sub>{b}</Sub>
          </div>
        ))}
      </div>

      <Down />

      <div className={box}>
        <span className="font-medium">Control API</span> <span className="text-muted">· FastAPI</span>
        <Sub>idempotency keys · quotas · suspension · approvals and questions inbox</Sub>
      </div>

      <Down />

      <div className="rounded-xl border border-dashed border-line p-2.5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <span className={label}>Durable run · Hatchet worker</span>
          <span className="font-mono text-[9.5px] text-muted">leases · replay journal · crash recovery</span>
        </div>

        <div className="rounded-lg border border-accent bg-accent/10 px-2.5 py-2 text-center text-[12.5px]">
          <span className="font-semibold">Orchestrator</span> <span className="text-muted">· LangGraph</span>
          <Sub>decide → delegate → decide … → answer or ask the owner</Sub>
        </div>

        <Down text="up to 4 delegations" />

        <div className="grid grid-cols-2 gap-1.5 @lg:grid-cols-4">
          {['Research', 'Communications', 'Scheduling', 'Data analytics'].map((n) => (
            <div key={n} className={box}>
              {n}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-1.5 @lg:grid-cols-2">
          <div className="rounded-lg bg-surface2/70 px-2.5 py-1.5 text-[11px] text-fg/80">
            <span className="text-muted">Memory</span> · long-term facts and preferences, short-term task state, frozen per run
          </div>
          <div className="rounded-lg bg-surface2/70 px-2.5 py-1.5 text-[11px] text-fg/80">
            <span className="text-muted">Context budget</span> · capped history and tool output, cache-friendly prompt order
          </div>
        </div>
      </div>

      <Down text="tools" />

      <div className="grid grid-cols-2 gap-1.5 @lg:grid-cols-[1fr_1fr_1fr_1.15fr_auto_1.1fr] @lg:items-stretch">
        <div className={box}>
          Web research
          <Sub>Tavily</Sub>
        </div>
        <div className={box}>
          Documents
          <Sub>PDF/Word search, cited</Sub>
        </div>
        <div className={box}>
          Analytics
          <Sub>exact-decimal imports</Sub>
        </div>
        <div className={box}>
          Connectors
          <Sub>MCP · Activepieces</Sub>
        </div>
        <div className="hidden items-center text-muted @lg:flex" aria-hidden="true">
          →
        </div>
        <div className={`${box} col-span-2 border-dashed border-amber @lg:col-span-1`}>
          <span className="text-amber">Owner approval</span>
          <Sub>exact payload and credential</Sub>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
        <span className={`${label} mr-1`}>Platform</span>
        {['PostgreSQL + RLS', 'Cloudflare R2', 'OpenBao', 'LiteLLM', 'Langfuse'].map((t) => (
          <span key={t} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10.5px] text-fg/75">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
