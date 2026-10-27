export interface Experience {
  id: string;
  role: string;
  org: string;
  /** Short text shown in the logo tile when there is no `logo`. Leave both out to show no tile. */
  mark?: string;
  /** Path in /public. Wide wordmarks are fine; `logoInvert` turns a dark logo white for the dark theme. */
  logo?: string;
  logoInvert?: boolean;
  /** Stacked wordmarks need more height to stay legible. */
  logoTall?: boolean;
  location: string;
  start: string;
  end: string;
  /** Line colour for this period. */
  color: string;
  paragraphs: string[];
  points?: string[];
  tags: string[];
}

// Oldest first: the line starts at the top left and ends on your current job.
export const experience: Experience[] = [
  {
    id: 'atrc',
    role: 'Research Assistant',
    org: 'ATRC · STEM Youth Mentorship Program',
    mark: 'ATRC',
    logo: '/logos/atrc.webp',
    logoTall: true,
    location: 'Abu Dhabi',
    start: 'Nov 2023',
    end: 'Sep 2024',
    color: '#1F9C8D',
    paragraphs: [
      'I researched non-stationary contextual-bandit algorithms and LLMs for recommender systems, focusing on settings where user preferences change over time.',
      'I added change-point detectors to the bandit algorithms so they adapt faster when the environment shifts, and benchmarked them in stochastic simulations.',
    ],
    tags: ['Python', 'Contextual bandits', 'Recommender systems', 'LLMs'],
  },
  {
    id: 'etisalat',
    role: 'AI Intern',
    org: 'Etisalat',
    mark: 'etisalat',
    logo: '/logos/etisalat.svg',
    location: 'Dubai',
    start: 'Jan 2025',
    end: 'Apr 2025',
    color: '#E0606A',
    paragraphs: [],
    points: [
      'Worked with business stakeholders to define requirements and help integrate an AI-powered recommendation engine into the Starz On Business platform.',
      'Architected a RAG solution using product guides and FAQs to automate tier-one customer support cases.',
      "Built a dashboard to track the assistant's performance and key operational metrics.",
    ],
    tags: ['RAG', 'LLM assistants', 'Recommendation', 'Dashboards'],
  },
  {
    id: 'adia',
    role: 'Machine Learning Research Intern',
    org: 'ADIA Lab',
    mark: 'ADIA LAB',
    logo: '/logos/adia-lab.png',
    logoInvert: true,
    location: 'Abu Dhabi',
    start: 'Jun 2025',
    end: 'Aug 2025',
    color: '#7C83F7',
    paragraphs: [],
    points: [
      'Trained a transformer-based encoder to predict in-hospital mortality from clinical time-series data derived from Electronic Health Records, managing compute-intensive experiments and systematically tracking model performance.',
      'Built an end-to-end pipeline that turns longitudinal Electronic Health Records into model-ready time series and clinical narratives, cutting projected processing time from 193.4 hours to 18 hours.',
      "Derived patient-level explanations of the encoder's predictions using attention- and gradient-based attribution, then used them with clinical narratives to fine-tune a transformer decoder for grounded report generation.",
    ],
    tags: ['PyTorch', 'Transformers', 'EHR', 'Explainability'],
  },
  {
    id: 'mansoura',
    role: 'Forward Deployed Engineer',
    org: 'Mansoura',
    location: 'Al Ain',
    start: 'Oct 2025',
    end: 'Present',
    color: '#BA7F28',
    paragraphs: ['Before this role, I worked part-time at Mansoura as a data analyst from 2021 to 2025.'],
    points: [
      "Worked directly with management and operational staff to understand workflows, define requirements, and build and deploy the company's internal operations platform as its sole technical contributor.",
      'Designed the platform using React, TypeScript, AWS, PostgreSQL, and Snowflake, with role-based access, backend APIs, document management, and scheduled cloud workflows.',
      'Built and maintained ETL pipelines to ingest company data from AWS into Snowflake for querying and downstream analysis.',
      'Built dashboards, automated operational reports, and added KPI forecasting to support management decisions.',
      'Developed an AI agent that matches unidentified rental payments to tenants using bank statements and payment history, reducing reconciliation from roughly two days of manual work by two employees to a few minutes.',
    ],
    tags: ['React', 'TypeScript', 'AWS', 'PostgreSQL', 'Snowflake', 'ETL', 'AI agents'],
  },
];
