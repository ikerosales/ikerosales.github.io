import awsLogo from "../../assets/experiences/aws.png";
import imdeaLogo from "../../assets/experiences/imdea.jpg";
import bauc3mLogo from "../../assets/experiences/bauc3m.png";
import ntuossLogo from "../../assets/experiences/ntuoss.png";
import salesforceLogo from "../../assets/experiences/salesforce.jpeg";
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
    id: "edu-uc3m",
    lane: "education",
    institution: "Universidad Carlos III de Madrid",
    shortName: "UC3M",
    role: "Dual Bachelor - Data Science & Telecommunications Engineering",
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
    role: "Exchange Year - Electronic & Electrical Engineering, Data Science & Engineering",
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
    role: "Machine Learning Member",
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
    role: "Research Intern",
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
    role: "Events & Community Associate",
    start: { y: 2024, m: 9 },
    end: { y: 2025, m: 8 },
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
    role: "Solutions Architect Intern",
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
    role: "Head of Events & Community",
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
    role: "Exchange Semester - Data Science",
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
    role: "AI Research Intern",
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
    role: "Solution Engineer Intern",
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
