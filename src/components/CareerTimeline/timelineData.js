import awsLogo from "../../assets/experiences/aws.png";
import imdeaLogo from "../../assets/experiences/imdea.jpg";
import bauc3mLogo from "../../assets/experiences/bauc3m.png";
import ntuossLogo from "../../assets/experiences/ntuoss.png";
import salesforceLogo from "../../assets/experiences/salesforce.jpeg";
import upmLogo from "../../assets/education/upm.png";
import uc3mLogo from "../../assets/education/Logo_UC3M.png";
import ntuLogo from "../../assets/education/nanyang-technological-university.png";
import sydneyLogo from "../../assets/education/university-of-sydney.png";

const _now = new Date();
export const NOW = { y: _now.getFullYear(), m: _now.getMonth() + 1 };
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const fmt = (y, m) => `${MONTHS[m - 1]} ${y}`;

export const durationLabel = (stop) => {
  const end = stop.ongoing ? NOW : stop.end;
  const months = (end.y - stop.start.y) * 12 + (end.m - stop.start.m);
  if (months < 12) return `${months} mo`;

  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : `${yrs}y ${rem}m`;
};

export const periodLabel = (stop) =>
  `${fmt(stop.start.y, stop.start.m)} - ${stop.ongoing ? "Present" : fmt(stop.end.y, stop.end.m)}`;

export const events = [
  {
    id: "edu-upm",
    lane: "education",
    institution: "Universidad Politécnica de Madrid",
    shortName: "UPM",
    brand: "UPM",
    role: "MSc in Artificial Intelligence",
    bandLabel: "MSc in AI",
    summary: "Master's in advanced Artificial Intelligence, taken alongside the Salesforce role.",
    start: { y: 2026, m: 9 },
    ongoing: true,
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: upmLogo,
    link: "https://www.upm.es",
    description: [
      "Master's degree in advanced concepts of Artificial Intelligence, taken alongside my role at Salesforce.",
    ],
  },
  {
    id: "edu-uc3m",
    lane: "education",
    institution: "Universidad Carlos III de Madrid",
    shortName: "UC3M",
    brand: "UC3M",
    role: "Dual Bachelor - Data Science & Telecommunications Engineering",
    bandLabel: "Dual Bachelor · Data Science & Telecom",
    summary: "Dual engineering degree (372 ECTS), with two bachelor theses on Transformers and neuro-symbolic forecasting.",
    start: { y: 2021, m: 9},
    end: { y: 2026, m: 6 },
    ongoing: false,
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: uc3mLogo,
    link: "https://www.linkedin.com/school/universidad-carlos-iii-de-madrid/",
    description: [
      "Dual engineering degree across data science and telecommunications. 5.5 years, 372 ECTS.",
      "Combines statistics, machine learning, signal processing and communications systems.",
      "Bachelor thesis work on Transformer-based models for communication networks and interpretable time series forecasting with multimodal neuro-symbolic models.",
    ],
  },
  {
    id: "edu-ntu",
    lane: "education",
    institution: "Nanyang Technological University",
    shortName: "NTU Singapore",
    brand: "NTU Singapore",
    role: "Exchange Year - Electronic & Electrical Engineering, Data Science & Engineering",
    bandLabel: "Exchange Year",
    summary: "Full year abroad: Deep Learning, Cybersecurity and Big Data Management, among others.",
    start: { y: 2023, m: 8 },
    end: { y: 2024, m: 5 },
    location: "Singapore",
    country: "sg",
    countryName: "Singapore",
    logo: ntuLogo,
    link: "https://www.linkedin.com/school/nanyang-technological-university/",
    description: [
      "Full academic year abroad through UC3M's exchange programme.",
      "Courses on Deep Learning, Analog Electronics, Cybersecurity, Big Data Management and more.",
      "Joined the NTU Open Source Society in parallel.",
    ],
  },
  {
    id: "com-ntuoss",
    lane: "community",
    institution: "NTU Open Source Society",
    shortName: "NTU OSS",
    brand: "NTU OSS",
    role: "Machine Learning Member",
    summary: "Compared ML and DL models for network-attack classification, reaching 98% accuracy.",
    start: { y: 2023, m: 11 },
    end: { y: 2024, m: 8 },
    location: "Singapore",
    country: "sg",
    countryName: "Singapore",
    logo: ntuossLogo,
    link: "https://www.linkedin.com/company/ntuoss",
    description: [
      "Implemented and compared different ML and DL algorithms.",
      "Reached 98% accuracy on classification of communication-network attacks.",
      "Collaborated with an international student team on open-source ML tooling.",
    ],
  },
  {
    id: "car-imdea",
    lane: "career",
    institution: "IMDEA Networks Institute",
    shortName: "IMDEA",
    brand: "IMDEA Networks",
    role: "Research Intern",
    summary: "Researched Transformer-based models for communication networks on real campus Wi-Fi data.",
    start: { y: 2024, m: 9 },
    end: { y: 2025, m: 5 },
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: imdeaLogo,
    link: "https://networks.imdea.org/",
    description: [
      "Research on Transformer-based models for communication networks.",
      "Built data pipelines and evaluated language-model approaches on real campus wifi data.",
      "Worked alongside PhD researchers on experimental research workflows.",
    ],
  },
  {
    id: "com-bauc3m-associate",
    lane: "community",
    institution: "UC3M Business Analytics Association",
    shortName: "BA UC3M - Associate",
    brand: "BA UC3M",
    role: "Events & Community Associate",
    summary: "Helped organize events with Revolut, Google, Oliver Wyman and Bankinter.",
    start: { y: 2024, m: 9 },
    end: { y: 2025, m: 7 },
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: bauc3mLogo,
    link: "https://www.linkedin.com/company/bauc3m",
    description: [
      "Helped organize events with top companies like Revolut, Google, Oliver Wyman and Bankinter.",
      "Brought students closer to the world of Business Analytics through curated programming.",
      "Moderated an industry roundtable (Revolut) and supported planning of events with 50+ attendees.",
    ],
  },
  {
    id: "car-aws",
    lane: "career",
    institution: "Amazon Web Services",
    shortName: "AWS",
    brand: "AWS",
    role: "Solutions Architect Intern",
    summary: "Designed scalable, secure cloud architectures with customers, from discovery to deployment.",
    start: { y: 2025, m: 6 },
    end: { y: 2025, m: 9 },
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: awsLogo,
    link: "https://www.linkedin.com/company/amazon-web-services/",
    description: [
      "Designed scalable, secure cloud architectures alongside the Solutions Architect team.",
      "Supported customers through AWS adoption: discovery to deployment.",
      "Contributed to automation and cost-optimization initiatives.",
    ],
  },
  {
    id: "com-bauc3m-head",
    lane: "community",
    institution: "UC3M Business Analytics Association",
    shortName: "BA UC3M - Head of Events",
    brand: "BA UC3M",
    role: "Head of Events & Community",
    summary: "Led a team of 4 running events with Microsoft, BlackRock and Revolut, up to 120+ attendees.",
    start: { y: 2025, m: 7 },
    end: { y: 2026, m: 5 },
    ongoing: false,
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: bauc3mLogo,
    link: "https://www.linkedin.com/company/bauc3m",
    description: [
      "Leading events with firms such as Microsoft, BlackRock and Revolut, from focused workshops to larger sessions with 120+ attendees.",
      "Managing a team of 4 across planning, coordination and event delivery.",
      "Working on the full event cycle: ideas, speakers, logistics, promotion and follow-up.",
    ],
  },
  {
    id: "edu-sydney",
    lane: "education",
    institution: "The University of Sydney",
    shortName: "USYD - Exchange Semester",
    brand: "USYD",
    role: "Exchange Semester - Data Science",
    bandLabel: "Exchange Semester",
    summary: "Coursework on Time Series Forecasting and Mobile Networks, alongside a research internship.",
    start: { y: 2026, m: 2 },
    end: { y: 2026, m: 6 },
    ongoing: false,
    location: "Sydney",
    country: "au",
    countryName: "Australia",
    logo: sydneyLogo,
    link: "https://www.linkedin.com/school/university-of-sydney/",
    description: [
      "Exchange semester at The University of Sydney.",
      "Coursework on Time Series Forecasting and Mobile Networks among others.",
      "Studying in parallel with a research internship at the same university.",
      [
        { text: "Ranked #18 globally — " },
        { text: "QS World University Rankings 2025", href: "https://www.topuniversities.com/universities/university-sydney" },
      ],
    ],
  },
  {
    id: "car-sydney",
    lane: "career",
    institution: "The University of Sydney",
    shortName: "USYD - AI Research",
    brand: "USYD",
    role: "AI Research Intern",
    summary: "Multimodal AI research for financial-indicator forecasting with Dr. Pablo Montero-Manso.",
    start: { y: 2026, m: 2 },
    end: { y: 2026, m: 5 },
    ongoing: false,
    location: "Sydney",
    country: "au",
    countryName: "Australia",
    logo: sydneyLogo,
    link: "https://www.linkedin.com/school/university-of-sydney/",
    description: [
      [
        { text: "Research in multimodal AI for financial-indicator forecasting with " },
        { text: "Dr. Pablo Montero-Manso", href: "https://profiles.sydney.edu.au/pablo.monteromanso"}, // TODO: add Pablo's USYD profile URL
        { text: "." },
      ],
    ],
  },
  {
    id: "car-salesforce",
    lane: "career",
    institution: "Salesforce",
    shortName: "Salesforce",
    brand: "Salesforce",
    role: "Solution Engineer Intern",
    summary: "Technical pre-sales on Agentforce and enterprise AI across the Salesforce stack.",
    start: { y: 2026, m: 6 },
    ongoing: true,
    location: "Madrid",
    country: "es",
    countryName: "Spain",
    logo: salesforceLogo,
    link: "https://www.linkedin.com/company/salesforce/",
    description: [
      "Specializing in Agentforce and enterprise AI solutions across the Salesforce stack.",
      "Developing expertise in Technical Pre-Sales, Solution Engineering, AI Agents, CRM and Solution Architecture.",
    ],
  },
];

export const chronological = [...events].sort((a, b) => {
  const dt = (b.start.y - a.start.y) * 12 + (b.start.m - a.start.m);
  if (dt !== 0) return dt;

  const order = { education: 0, career: 1, community: 2 };
  return order[a.lane] - order[b.lane];
});

export const abroadPeriods = [
  { id: "abr-singapore", countryName: "Singapore", country: "sg", stopIds: ["edu-ntu", "com-ntuoss"] },
  { id: "abr-sydney", countryName: "Australia", country: "au", stopIds: ["edu-sydney", "car-sydney"] },
];

export const lanes = {
  education: { id: "education", label: "Education", color: "var(--ln-edu)" },
  career: { id: "career", label: "Career", color: "var(--ln-car)" },
  community: { id: "community", label: "Communities", color: "var(--ln-com)" },
};
