import aws from "../../assets/about/aws.webp";
import nova from "../../assets/about/nova.webp";
import comunidadMadrid from "../../assets/about/comunidad-madrid.webp";
import santander from "../../assets/about/santander.webp";
import upm from "../../assets/about/upm.webp";
import flagEs from "../../assets/about/flag-es.webp";
import flagSg from "../../assets/about/flag-sg.webp";
import flagAu from "../../assets/about/flag-au.webp";

export const now = [
  { title: "Solution Engineering", sub: "Salesforce · Agentforce", brand: "salesforce" },
  { title: "MSc in Artificial Intelligence", sub: "Universidad Politécnica de Madrid", img: upm, alt: "UPM" },
];

export const stats = [
  { value: 8.82, decimals: 2, label: ["GPA / 10", "dual degree"] },
  { value: 8, decimals: 0, label: ["subjects", "with honours"] },
];

export const countries = [
  { name: "Spain", flag: flagEs },
  { name: "Singapore", flag: flagSg },
  { name: "Australia", flag: flagAu },
];

export const doing = [
  {
    glyph: "presales",
    title: "Pre-sales & Solution Engineering",
    text: "At Salesforce I build Agentforce agents for customer demos and join enterprise client meetings. At AWS I designed customer architectures, from discovery to deployment.",
  },
  {
    glyph: "series",
    title: "Applied ML & Data Science",
    text: "A neuro-symbolic forecaster that beat Chronos-2 and TimesFM, Transformers on 6M Wi-Fi events, NLP on 12K+ job postings.",
  },
  {
    glyph: "graph",
    title: "AI agents",
    text: "Multi-agent systems with the OpenAI Agents SDK and RAG, evaluated with RAGAS and LLM-as-a-Judge, not just demoed.",
  },
];

export const certs = [
  {
    title: "AWS Solutions Architect – Associate",
    sub: "Amazon Web Services · 2025",
    logo: aws, alt: "AWS", padded: true,
    href: "https://www.credly.com/badges/e0b682e4-f13c-4b96-a253-ea5b0c1be1c0/public_url",
  },
  {
    title: "AWS AI Practitioner",
    sub: "Amazon Web Services · 2025",
    logo: aws, alt: "AWS", padded: true,
    href: "https://www.credly.com/badges/7462e0a4-852e-49f8-a34e-7b8ee3cbdc70/public_url",
  },
  {
    title: "Nova 111 Student List 2026",
    sub: "Top students under 25 in Spain · Telecom",
    logo: nova, alt: "Nova",
    href: "https://www.novatalent.com/111/spain",
  },
  {
    title: "Excellence Scholarship", times: 2,
    sub: "Comunidad de Madrid · 2021, 2025",
    logo: comunidadMadrid, alt: "Comunidad de Madrid",
  },
  {
    title: "International Mobility Scholarship", times: 2,
    sub: "Banco Santander · 2023, 2025",
    logo: santander, alt: "Santander",
  },
];

// [label, brand slug or "g:<glyph>", colour override]
export const skills = [
  {
    key: "ai", title: "AI & Agents", glyph: "graph", color: "var(--ab-accent)",
    tools: [["LangChain", "langchain"], ["LangGraph", "g:graph", "#7FD1C3"], ["OpenAI Agents SDK", "openai"], ["MCP", "g:plug", "#D4A27F"], ["RAG", "g:rag", "#ffee10"], ["Vector DBs", "g:vectors", "#ffee10"], ["RAGAS", "g:check", "#ffee10"], ["LLM-as-a-Judge", "g:scales", "#ffee10"], ["Agentforce", "salesforce"]],
  },
  {
    key: "ml", title: "ML & Data", glyph: "series", color: "var(--ab-edu)",
    tools: [["Python", "python", "#5A9FD4"], ["PyTorch", "pytorch"], ["Hugging Face", "huggingface"], ["scikit-learn", "scikitlearn"], ["XGBoost", "g:tree", "#58c7ff"], ["pandas", "pandas"], ["PySpark", "apachespark"], ["MLflow", "mlflow"], ["spaCy", "spacy"], ["SQL", "g:db", "#58c7ff"], ["Time series", "g:series", "#58c7ff"]],
  },
  {
    key: "cloud", title: "Cloud & Engineering", glyph: "cloud", color: "var(--ab-com)",
    tools: [["Salesforce", "salesforce"], ["AWS Bedrock", "amazonwebservices"], ["SageMaker", "amazonwebservices"], ["Lambda", "awslambda"], ["S3", "amazons3"], ["AWS CDK", "amazonwebservices"], ["Docker", "docker"], ["CI/CD", "g:loop", "#ff8a4c"], ["FastAPI", "fastapi"], ["PostgreSQL", "postgresql", "#6b8ff0"], ["Git", "git"], ["Linux", "linux"], ["Grafana", "grafana"]],
  },
];

// brand colours that are too dark on black get a readable stand-in
export const READABLE = { amazonwebservices: "#FF9900", langchain: "#7FD1C3", openai: "#f2f2f2", pandas: "#E70488" };

// Line glyphs for things without a brand mark (24×24, stroke). pathLength lets them draw themselves.
export const GLYPHS = {
  cloud: '<path d="M7 18.5h10.5a4.5 4.5 0 0 0 .6-8.96A6.5 6.5 0 0 0 5.6 9.3 4.6 4.6 0 0 0 7 18.5z"/>',
  graph: '<circle cx="5" cy="6" r="2.4"/><circle cx="19" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.3 6h9.4M6.2 8.2l4.6 7.6M17.8 8.2l-4.6 7.6"/>',
  plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4"/>',
  rag: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h5"/><path d="M14 3l5 5v3M14 3v5h5M8 10h6M8 14h3"/><circle cx="16.5" cy="16.5" r="3"/><path d="M18.7 18.7L21 21"/>',
  vectors: '<circle cx="5" cy="17" r="1.6"/><circle cx="10" cy="9" r="1.6"/><circle cx="16" cy="14" r="1.6"/><circle cx="19" cy="5" r="1.6"/><path d="M3 21h18M3 21V3"/>',
  check: '<path d="M12 2l2.4 2.2 3.2-.4.9 3.1 2.8 1.6-1 3 1 3-2.8 1.6-.9 3.1-3.2-.4L12 22l-2.4-2.2-3.2.4-.9-3.1-2.8-1.6 1-3-1-3 2.8-1.6.9-3.1 3.2.4z"/><path d="M8.5 12l2.4 2.4 4.6-4.8"/>',
  scales: '<path d="M12 3v18M7 21h10M4 7h16M4 7l-2.5 6a2.5 2.5 0 0 0 5 0zM20 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
  tree: '<circle cx="12" cy="4.5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="3.5" cy="19.5" r="1.6"/><circle cx="8.5" cy="19.5" r="1.6"/><path d="M10.6 6l-3.2 4.4M13.4 6l3.2 4.4M5.2 13.8l-1 4.2M6.8 13.8l1 4.2"/>',
  db: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
  series: '<path d="M3 3v18h18"/><path d="M6.5 15l3.5-4.5 3 2.5 4.5-6.5 3 3"/>',
  loop: '<path d="M20 11a8 8 0 0 0-14.6-4.5L3 9M3 4v5h5M4 13a8 8 0 0 0 14.6 4.5L21 15M21 20v-5h-5"/>',
  presales: '<path d="M3 4h18v12H3zM8 20h8M12 16v4"/><path d="M7 12l3-3 2.5 2.5L17 7"/>',
};
