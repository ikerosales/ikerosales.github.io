import feverProjectImage from "../assets/projects/fever_project_updated.webp";
import skillGapImage from "../assets/projects/skill_gap_video_portada.webp";
import dataJobOffersImage from "../assets/projects/data_ai_job_offers.webp";
import smartphonesImage from "../assets/projects/smartphones.webp";
import mobilityTfgImage from "../assets/projects/mobility-tfg-head.webp";
import forecastingTfgImage from "../assets/projects/tfg-forecasting-head.webp";
// lightweight card thumbnails (WebP, ~800px); the full images are kept for the detail view
import feverProjectThumb from "../assets/projects/thumbs/fever_project_updated.webp";
import skillGapThumb from "../assets/projects/thumbs/skill_gap_video_portada.webp";
import dataJobOffersThumb from "../assets/projects/thumbs/data_ai_job_offers.webp";
import smartphonesThumb from "../assets/projects/thumbs/smartphones.webp";
import mobilityTfgThumb from "../assets/projects/thumbs/mobility-tfg-head.webp";
import forecastingTfgThumb from "../assets/projects/thumbs/tfg-forecasting-head.webp";

export const aboutData = {
  description: `I'm currently pursuing an MSc in Artificial Intelligence at Universidad Politécnica de Madrid while working as a Solution Engineer at Salesforce. I recently graduated in Data Science and Telecommunications Engineering from UC3M, with exchange years at NTU Singapore and the University of Sydney, where I also did research. My background spans full ML/DL projects at IMDEA and The University of Sydney, cloud solutions architecture at AWS and Salesforce. I enjoy building things that are useful, clear, and technical enough to actually work.`
};

export const projects = [
  {
    slug: "neurosym-forecasting",
    name: "Adjusted by Text: A Neuro-Symbolic Approach to Metadata-Enriched Time Series Forecasting",
    subtitle: "Neuro-symbolic multimodal time series forecasting",
    kind: "Bachelor thesis",
    category: "thesis",
    highlights: [
      { value: "194K", label: "macro series" },
      { value: "~189K", label: "parameters" },
    ],
    description: "Neuro-symbolic forecasting model that conditions predictions on textual metadata, paired with a large multimodal macroeconomic dataset built from FRED.",
    details: [
      "Built a multimodal dataset from the FRED API: 194,442 monthly macroeconomic series enriched with expert-curated textual metadata.",
      "Designed NeuroSym-CBF, a ~189K parameter architecture combining a patch-based time series encoder, frozen T5 metadata embeddings, and a symbolic forecasting head (trend, seasonality, intercept).",
      "Introduced a TopK Sparse Autoencoder concept bottleneck modulated with FiLM, allowing concepts to be inspected, edited, or knocked out before the forecast is produced.",
      [
        { text: "Benchmarked against " },
        { text: "Chronos 2", href: "https://huggingface.co/amazon/chronos-2" },
        { text: " (Amazon), " },
        { text: "Chronos-bolt-base", href: "https://huggingface.co/amazon/chronos-bolt-base" },
        { text: " (Amazon), " },
        { text: "TimesFM 200M", href: "https://huggingface.co/google/timesfm-1.0-200m" },
        { text: " (Google) and AutoETS, beating all in Win Rate, MAE, and MASE across 5 context for an horizon of 18 months." },
      ]
    ],
    technologies: ["Python", "PyTorch", "HuggingFace Transformers", "scikit-learn", "statsforecast", "Sparse Autoencoders", "FiLM", "FRED API", "LaTeX"],
    link: "https://github.com/ikerosales/NeuroSym-CBF",
    pdf: "/tfgs/neurosymbolic-with-metadata-timeseries-forecaster.pdf",
    image: forecastingTfgImage,
    thumb: forecastingTfgThumb,
    accent: "TFG"
  },
    {
    slug: "wlan-mobility",
    name: "Transformer-Based Continuous-Time Modeling of User Mobility in Campus WLAN",
    subtitle: "WiFi mobility prediction & synthetic trace generation",
    kind: "Bachelor thesis",
    category: "thesis",
    highlights: [
      { value: "~6M", label: "Wi-Fi events" },
      { value: "72.5%", label: "top-1 accuracy" },
    ],
    description: "Decoder-only Transformer-based model trained on real campus WiFi logs to predict where users move next and when, then used to generate privacy-preserving synthetic mobility traces.",
    details: [
      "Processed ~6M authentication events from 17,395 devices across 280 access points (UC3M / IMDEA Networks).",
      "Jointly predicts next location (AP) and continuous inter-event time (Δt), not just discrete steps.",
      "Autoregressive synthetic trace generation evaluated against real distributions (KL divergence < 0.084).",
      "Privacy validation via Membership Inference Attack — model leaks no individual data.",
      "72.46% top-1 spatial accuracy on a real university campus dataset."
    ],
    technologies: ["Python", "PyTorch", "Transformer", "Pandas", "NumPy", "LaTeX"],
    link: null,
    githubDisabled: true,
    pdf: "/tfgs/continuous-mobility-modeling-wlan.pdf",
    image: mobilityTfgImage,
    thumb: mobilityTfgThumb,
    accent: "TFG"
  },
  {
    slug: "fever-agents",
    name: "Fever Multi-Agent Recommendation System",
    subtitle: "Multi-agent leisure planning prototype",
    kind: "With FEVER",
    category: "ai",
    highlights: [
      { value: "5", label: "specialised agents" },
      { value: "RAGAS", label: "+ LLM-as-a-Judge" },
    ],
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
    thumb: feverProjectThumb,
    accent: "FEV"
  },
  {
    slug: "skill-gap",
    name: "Skill Gap Analysis",
    subtitle: "Career analytics Streamlit app",
    kind: "Live app",
    category: "ai",
    highlights: [
      { value: "5", label: "analysis views" },
      { value: "Graph", label: "skill scoring" },
    ],
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
    thumb: skillGapThumb,
    accent: "SG"
  },
  {
    slug: "nlp-job-offers",
    name: "NLP Data Job Offers",
    subtitle: "NLP analysis of data-related job posts",
    kind: "Honors",
    category: "ai",
    highlights: [
      { value: "12K+", label: "job postings" },
      { value: "5", label: "text representations" },
    ],
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
    thumb: dataJobOffersThumb,
    accent: "NLP"
  },
  {
    slug: "smartphone-pricing",
    name: "Smartphone Market Pricing",
    subtitle: "Price prediction with R",
    category: "ml",
    highlights: [
      { value: "3", label: "models compared" },
      { value: "R", label: "caret + tidymodels" },
    ],
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
    thumb: smartphonesThumb,
    accent: "R"
  }
]; 
