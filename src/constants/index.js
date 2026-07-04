import feverProjectImage from "../assets/projects/fever_project_updated.png";
import skillGapImage from "../assets/projects/skill_gap_video_portada.jpg";
import dataJobOffersImage from "../assets/projects/data_ai_job_offers.png";
import smartphonesImage from "../assets/projects/smartphones.jpeg";

export const aboutData = {
  description: `I recently graduated in Data Science and Telecommunications Engineering from UC3M, with exchange years at NTU Singapore and the University of Sydney, where I also did research. My background spans full ML/DL projects at IMDEA and The University of Sydney, cloud solutions architecture at AWS and Salesforce. I enjoy building things that are useful, clear, and technical enough to actually work.`
};

export const projects = [
  {
    name: "Fever Multi-Agent Recommendation System",
    subtitle: "Multi-agent leisure planning prototype",
    description: "Academic prototype developed with FEVER to plan leisure itineraries through a conversational multi-agent system.",
    details: [
      "Uses separate agents for triage, web search, FEVER plan loading, recommendation, and route calculation.",
      "Combines FEVER catalog data from CSV samples with public web activities.",
      "Builds hour-by-hour plans while checking schedule conflicts and travel feasibility.",
      "Evaluated offline with RAGAS and an LLM-as-a-Judge setup against a single-agent baseline."
    ],
    technologies: ["Python", "OpenAI Agents SDK", "RAGAS", "LLM-as-a-Judge"],
    link: "https://github.com/ds-uc3m-fever-chatbot/Multi-Agent-Planning-Recommendation-System",
    image: feverProjectImage,
    accent: "FEV"
  },
  {
    name: "Skill Gap Analysis",
    subtitle: "Career analytics Streamlit app",
    description: "NLP-driven platform that compares a candidate's skills with job requirements and surfaces gaps, matches, and recommendations.",
    details: [
      "Fetches job postings through JSearch/OpenWebNinja and caches results locally.",
      "Extracts and normalizes skills with spaCy and a custom taxonomy.",
      "Scores skill gaps using job frequency, seniority signals, and graph-based importance.",
      "Includes Streamlit tabs for overview, skills, job matches, recommendations, and graph analysis."
    ],
    technologies: ["Python", "Streamlit", "spaCy", "NetworkX", "Plotly"],
    link: "https://github.com/skill-gap-dev/skill_gap_analysis",
    live: "https://skill-gap-analysis.streamlit.app/",
    image: skillGapImage,
    accent: "SG"
  },
  {
    name: "NLP Data Job Offers",
    subtitle: "NLP analysis of data-related job posts",
    description: "Analysis of thousands of Data & AI job offers using text preprocessing, vectorization, topic modeling, salary prediction, and a dashboard.",
    details: [
      "Merged and cleaned public job-offer datasets into a unified dataset with more than 12,000 postings.",
      "Processed job descriptions with spaCy and represented text using TF-IDF, FastText, LDA, Doc2Vec, and SBERT.",
      "Explored topics and clusters in job descriptions, then trained salary regression models.",
      "Compared MLP and XGBoost models, with XGBoost performing better across the reported vectorization setups."
    ],
    technologies: ["Python", "NLP", "spaCy","scikit-learn", "XGBoost", "PyTorch"],
    link: "https://github.com/ikerosales/NLP-Data-Job-Offers",
    image: dataJobOffersImage,
    accent: "NLP"
  },
  {
    name: "Smartphone Market Pricing",
    subtitle: "Price prediction with R",
    description: "Machine learning project in R focused on estimating smartphone prices from brand, specifications, and market-related features.",
    details: [
      "Preprocessed the dataset with missing-value handling, feature scaling, and categorical encoding.",
      "Compared Linear Regression, Random Forest, and XGBoost models.",
      "Used R pipelines with tools such as caret and tidymodels for preprocessing, feature selection, and training.",
      "Framed as a practical predictive modeling exercise for market analysis and price estimation."
    ],
    technologies: ["R", "caret", "tidymodels", "Random Forest", "XGBoost"],
    link: "https://github.com/ikerosales/Predictive-Modeling-for-Smartphone-Market-Pricing",
    image: smartphonesImage,
    accent: "R"
  }
]; 
