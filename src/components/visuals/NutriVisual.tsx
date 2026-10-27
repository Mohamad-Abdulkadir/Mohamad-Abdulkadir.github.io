const box = 'rounded-lg border border-line bg-surface px-2.5 py-2 text-[12.5px] leading-tight';
const mine = 'rounded-lg border border-accent/70 bg-accent/10 px-2.5 py-2 text-[12.5px] leading-tight';
const label = 'font-mono text-[9.5px] tracking-[0.14em] text-muted uppercase';

function Sub({ children }: { children: React.ReactNode }) {
  return <div className="mt-0.5 text-[10.5px] text-muted">{children}</div>;
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-[13px] text-muted" aria-hidden="true">
      <span className="@lg:hidden">↓</span>
      <span className="hidden @lg:inline">→</span>
    </div>
  );
}

function Row({ cols, children }: { cols: string; children: React.ReactNode }) {
  return <div className={`grid grid-cols-1 gap-1 @lg:items-stretch @lg:gap-1.5 ${cols}`}>{children}</div>;
}

/** NutriVision's AI pipeline (my part), and the app the team built around it. */
export default function NutriVisual() {
  return (
    <div
      role="img"
      aria-label="NutriVision AI pipeline. Detection: five detectors were compared, YOLOv11s was fine-tuned on a food dataset, exported to ONNX and run on-device in Unity. Weight estimation: the detection crop and shape features pass through a CNN backbone and dense head to estimate grams, trained on food that was weighed and photographed. The team's app then looks up nutrition and shows a label in mixed reality."
      className="text-fg"
    >
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          ['≈45%', 'mAP, fine-tuned YOLOv11s'],
          ['1.28 ms', 'inference per image'],
          ['5', 'detectors compared'],
        ].map(([v, l]) => (
          <div key={l} className="rounded-lg border border-line bg-surface px-2.5 py-2">
            <div className="font-serif text-[1.25rem] leading-none sm:text-[1.45rem]">{v}</div>
            <div className="mt-1 text-[10.5px] leading-snug text-muted sm:text-[11px]">{l}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-accent/50 p-2.5">
        <div className="flex items-center justify-between">
          <span className={label}>My part · AI</span>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9.5px] text-accent">Python · PyTorch</span>
        </div>

        <div>
          <div className={`${label} mb-1.5`}>Food detection</div>
          <Row cols="@lg:grid-cols-[1fr_auto_1.1fr_auto_1fr_auto_1fr]">
            <div className={mine}>
              Model selection
              <Sub>YOLOv11n/s, YOLOv8n/s, RT-DETR</Sub>
            </div>
            <Arrow />
            <div className={mine}>
              Fine-tune YOLOv11s
              <Sub>labelled food dataset</Sub>
            </div>
            <Arrow />
            <div className={mine}>
              Export to ONNX
              <Sub>for on-device inference</Sub>
            </div>
            <Arrow />
            <div className={box}>
              Runs in Unity
              <Sub>HoloLens 2 · iPhone</Sub>
            </div>
          </Row>
        </div>

        <div>
          <div className={`${label} mb-1.5`}>Weight estimation</div>
          <Row cols="@lg:grid-cols-[1.15fr_auto_1fr_auto_0.8fr]">
            <div className={mine}>
              Detection crop + features
              <Sub>food type, area, aspect ratio, pixel intensity</Sub>
            </div>
            <Arrow />
            <div className={mine}>
              CNN backbone + dense head
              <Sub>3 dense layers, ReLU</Sub>
            </div>
            <Arrow />
            <div className={mine}>
              Weight (g)
              <Sub>portion size</Sub>
            </div>
          </Row>
          <div className="mt-1.5 text-[11px] text-muted">Trained on apples, oranges, pears, avocados, cucumbers and rice we weighed and photographed ourselves.</div>
        </div>
      </div>

      <div className="py-1.5 text-center text-[13px] text-muted" aria-hidden="true">
        ↓
      </div>

      <div>
        <div className={`${label} mb-1.5`}>Team · mixed-reality app</div>
        <Row cols="@lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
          <div className={box}>
            Nutrition lookup
            <Sub>USDA FoodData Central · Open Food Facts</Sub>
          </div>
          <Arrow />
          <div className={box}>
            Nutrition label in MR
            <Sub>calories, protein, carbs, fat</Sub>
          </div>
          <Arrow />
          <div className={box}>
            Basket and journal
            <Sub>Firebase</Sub>
          </div>
        </Row>
      </div>
    </div>
  );
}
