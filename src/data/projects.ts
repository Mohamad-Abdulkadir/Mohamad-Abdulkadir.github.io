export interface ProjectLink {
  label: string;
  href: string;
  /** Show this message in a toast instead of following the link (e.g. a post that isn't out yet). */
  toast?: string;
}

export interface Project {
  id: string;
  name: string;
  /** Which visual to render on the right of the card. */
  visual: 'gni' | 'forecast' | 'rag' | 'nutri';
  paragraphs?: string[];
  points?: string[];
  tags: string[];
  badge?: { strong: string; text: string };
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'gni',
    name: 'GNI',
    visual: 'gni',
    paragraphs: [
      'A platform that runs small businesses through AI agents. Each business gets an orchestrator that takes the owner’s requests, delegates to research, communications, scheduling and analytics specialists, checks their results and replies.',
    ],
    points: [
      'Durable runs on Hatchet with leases, crash recovery and a replay journal that never repeats an uncertain model or tool call',
      'Bounded multi-specialist delegation, owner questions that pause a run and resume it as a linked run, and recurring schedules',
      'External actions wait for owner approval, bound to the exact payload, account and credential version',
      'Per-customer isolation with PostgreSQL row-level security, OpenBao secrets, scoped storage and quotas',
      'Long- and short-term agent memory and context budgets, ordered to keep prompt caches warm',
    ],
    tags: ['Python', 'FastAPI', 'LangGraph', 'LiteLLM', 'Hatchet', 'PostgreSQL', 'MCP', 'React'],
    links: [
      {
        label: 'Context management in multi-agent apps',
        href: '#',
        toast: 'The post on context management in multi-agent apps is coming soon.',
      },
    ],
  },
  {
    id: 'power',
    name: 'German Power Day-Ahead Forecasting',
    visual: 'forecast',
    paragraphs: [
      'An end-to-end forecasting pipeline for the DE/LU day-ahead power market, from public ENTSO-E and EEX data to trading-desk fair-value views.',
    ],
    points: [
      'Ingests 10 ENTSO-E and EEX datasets, normalizes them to hourly tables and runs deterministic plus Gemini-generated quality checks',
      'Builds price lags, fundamentals, calendar and carbon features over 24,000 hours of history',
      'Benchmarks ridge, LightGBM, XGBoost and CatBoost with walk-forward validation, reaching a best MAE of 13.65 EUR/MWh',
      'Turns hourly forecasts into weekly and monthly baseload, peak and off-peak fair-value bands with buy/sell signals',
    ],
    tags: ['Python', 'LightGBM', 'pandas', 'Walk-forward CV', 'ENTSO-E', 'Gemini'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Mohamad-Abdulkadir/Day-Ahead-Forecasting' },
      { label: 'API docs', href: 'https://www.postman.com/mohmadabdulkadir-2194960/day-ahead-forecasting-german-power' },
    ],
  },
  {
    id: 'rag',
    name: 'AwesomeRAG',
    visual: 'rag',
    paragraphs: [
      'A document RAG workspace: upload files, extract them to Markdown, index them locally and chat with answers grounded in the retrieved passages.',
    ],
    points: [
      'Granite Docling OCR and EmbeddingGemma-300M run on the local machine, with Gemini as optional cloud OCR',
      'Classifies each question’s intent (question, summary, extraction, comparison, citation) before retrieval',
      'Streams answers with visible source attribution, backed by an in-memory Qdrant index',
    ],
    tags: ['Next.js', 'FastAPI', 'Docling', 'Qdrant', 'Cerebras'],
    links: [{ label: 'GitHub', href: 'https://github.com/Mohamad-Abdulkadir/AwesomeRAG' }],
  },
  {
    id: 'nutri',
    name: 'NutriVision',
    visual: 'nutri',
    paragraphs: [
      'A mixed-reality nutrition tracker for HoloLens 2 and iPhone: look at food and its calories and macros appear in front of you. I built the AI side: food detection and weight estimation.',
    ],
    points: [
      'Compared YOLOv11n/s, YOLOv8n/s and RT-DETR, then fine-tuned YOLOv11s for food detection (about 45% mAP, 1.28 ms per image)',
      'Converted the detector to ONNX so it runs on-device inside the Unity app on HoloLens 2 and iPhone',
      'Prototyped a single-image weight-estimation model: the detection crop plus area, aspect ratio and intensity features, through a CNN backbone and dense head',
      'Trained it on food we weighed and photographed ourselves, so detected portions can be turned into calories and macros',
    ],
    tags: ['YOLOv11', 'PyTorch', 'ONNX', 'Unity', 'HoloLens 2'],
    badge: { strong: '3rd place', text: 'UAEU Innovation Challenge' },
    links: [],
  },
];
