import { Product } from "@/types/products"

export const products: Product[] = [
  {
    id: "ai-interviewer",
    title: "AI Interviewer",
    tagline: "LLM-powered mock interview system with adaptive difficulty & real-time evaluation",
    overview: "Built a multi-mode AI interviewer with RAG-based question generation, real-time video intelligence, adaptive difficulty scaling, and comprehensive performance analytics with hiring-grade scoring.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/ai-interviewer.png",
    liveUrl: "https://chowdary1-ai-interviewer-version-2.hf.space/login",
    techStack: ["React","FastAPI","OpenAI","Supabase","LangChain","RAG", "Tailwind CSS", "TypeScript"],
    businessProblems: [
      "Job seekers lack access to realistic, high-quality interview practice",
      "Need for personalized feedback and adaptive difficulty in interviews"
    ],
    features: [
      { title: "Multi-Mode Interviews", description: "Supports Technical, HR, and Behavioral interviews with adaptive questioning." },
      { title: "Real-Time Evaluation", description: "AI analyzes responses instantly and provides detailed feedback and scoring." },
      { title: "Video Intelligence", description: "Real-time facial expressions and voice analysis for deeper insights." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "React", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions and interview videos are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "ai-stock-price-predictor",
    title: "AI Stock Price Predictor",
    tagline: "Deep Learning Time-Series Forecasting",
    overview: "LSTM-based deep learning model for stock price prediction using technical indicators like RSI, MACD, SMA, and EMA. Achieved 84% directional accuracy with real-time data visualization, MLflow experiment tracking, and DVC pipeline versioning.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/stock.png",
    liveUrl: "https://naveen-2007-ai-stock-predictor.hf.space/",
    techStack: ["Python","TensorFlow","LSTM","mlops","Pandas","plotly"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "cricklytics",
    title: "Cricklytics",
    tagline: "Cricket Analytics & Prediction System",
    overview: "Production-ready cricket analytics platform built on ball-by-ball match data for International T20 and IPL competitions. Uses separate ML pipelines per competition for first-innings score prediction, second-innings win probability, and real-time chase forecasting with artifact-based inference.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/cricket.png",
    liveUrl: "https://naveen-2007-cricklytics.hf.space/",
    techStack: ["Python","Pandas","numpy","plotly","Scikit-learn","Flask","Docker","Mlops","Hugging Face Spaces"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "diabetes-risk-prediction",
    title: "Diabetes Risk Prediction",
    tagline: "End-to-End ML Pipeline",
    overview: "End-to-end machine learning pipeline for diabetes risk assessment using RandomForest, achieving 87% accuracy. Features automated data preprocessing, model evaluation, and a production-ready Flask REST API for real-time predictions.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/diabetes.png",
    liveUrl: "https://naveen-2007-diabetes.hf.space/",
    techStack: ["Python","Scikit-learn","Flask","Pandas","NumPy"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "perplexity-ai-clone",
    title: "Perplexity AI Clone",
    tagline: "RAG-Based Intelligent Search",
    overview: "AI-powered search engine clone built with RAG architecture, combining real-time web retrieval with vector database search and LLM-powered response generation for accurate, context-aware answers with source citations.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/perplexity.png",
    liveUrl: "https://naveen-2007-perplexity-clone.hf.space/",
    techStack: ["Python","LangChain","Langgraph","FAISS","HuggingFace","FastAPI","groq","streamlit"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "genai-intelligence-studio",
    title: "GenAI Intelligence Studio",
    tagline: "Multi-Model RAG System",
    overview: "Enterprise-grade multi-model RAG system integrating LLaMA, Mistral, Gemini, and ChatGPT with agentic AI workflows using LangChain and LangGraph for complex reasoning, document processing, and automated insight generation.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/genai.png",
    liveUrl: "https://naveenkumar-2007--genai-intelligence-studi-streamlit-app-dikk0q.streamlit.app/",
    techStack: ["Python","LangChain","LangGraph","groq","Streamlit"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "fake-news-detection-api",
    title: "Fake News Detection API",
    tagline: "NLP Classification Model",
    overview: "NLP-based fake news classification system using TF-IDF vectorization and machine learning. Provides FastAPI REST endpoints with interactive Swagger docs for real-time news article authenticity verification.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/Facknews.png",
    liveUrl: "https://news-qzod.onrender.com/docs",
    techStack: ["Python","NLP","TF-IDF","FastAPI","Scikit-learn"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "network-security-predictor",
    title: "Network Security Predictor",
    tagline: "ML-Based Cyber Threat Detection",
    overview: "Machine learning-powered network security system that detects and classifies cyber threats, intrusion attempts, and network anomalies in real-time using trained classification models deployed as a cloud API.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/networksecurty.png",
    liveUrl: "https://security-clou.onrender.com/",
    techStack: ["Python","Scikit-learn","Pandas","ML"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "cifar-10-image-classifier",
    title: "CIFAR-10 Image Classifier",
    tagline: "CNN Deep Learning Model",
    overview: "Deep learning image classifier built with Convolutional Neural Networks trained on the CIFAR-10 dataset. Classifies images across 10 categories with data augmentation, batch normalization, and an interactive Streamlit interface.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/cifar-10.png",
    liveUrl: "https://naveenkumar-2007-image-cnn-0tfygw.streamlit.app/",
    techStack: ["Python","TensorFlow","Keras","CNN","Streamlit"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "weather-prediction-system",
    title: "Weather Prediction System",
    tagline: "ML-Based Forecasting",
    overview: "Machine learning weather forecasting system that predicts weather conditions using historical meteorological data. Features data visualization, trend analysis, and a deployed REST API for real-time weather predictions.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/weather.png",
    liveUrl: "https://weather-gxiw.onrender.com/last",
    techStack: ["Python","Scikit-learn","Pandas","Matplotlib"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "article-analyzer",
    title: "Article Analyzer",
    tagline: "NLP Summarization & Sentiment",
    overview: "NLP-powered article analysis tool that performs automatic text summarization and sentiment analysis using HuggingFace transformers. Features an intuitive Streamlit interface for uploading and analyzing articles in real-time.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/Article.png",
    liveUrl: "https://naveenkumar-2007-artical-analyzer-app-aa8n5m.streamlit.app/",
    techStack: ["Python","NLP","HuggingFace","Streamlit"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  },
  {
    id: "student-math-performance-prediction",
    title: "Student Math Performance Prediction",
    tagline: "ML Random Forest Model — 84% Accuracy",
    overview: "Random Forest machine learning model trained on educational dataset features to predict student math scores. Uses inputs like gender, parental education, lunch type, test preparation, reading score, and writing score with an interactive web interface for real-time predictions.",
    status: "Available",
    bestFor: "AI & ML",
    imageUrl: "/images/projects/mathprediction.png",
    liveUrl: "https://mlprojectmath-score.onrender.com/predictdata",
    techStack: ["Python","Scikit-learn","Pandas","NumPy","Flask","Matplotlib","Seaborn"],
    businessProblems: [
      "Need for automated intelligence and predictive insights",
      "Manual processes that can be accelerated by AI"
    ],
    features: [
      { title: "Scalable Architecture", description: "Built using modern frameworks capable of handling high loads." },
      { title: "Real-time Processing", description: "Fast inference and prediction pipelines." }
    ],
    architectureDescription: "This project leverages modern ML libraries and frameworks, orchestrated together to provide real-time inference and seamless user experiences via robust backend APIs and intuitive frontends.",
    integrations: [
      { name: "Python", logoId: "aws" },
      { name: "FastAPI", logoId: "aws" }
    ],
    security: [
      { title: "Data Privacy", description: "All predictions are processed securely." }
    ],
    pricing: [
      { name: "Enterprise", description: "Custom deployment.", features: ["Full source code", "Deployment support"], ctaText: "Contact for Pricing" }
    ],
    faq: [
      { question: "Can this be customized?", answer: "Yes, this model/application can be fine-tuned and integrated into your specific business workflow." }
    ]
  }
];
