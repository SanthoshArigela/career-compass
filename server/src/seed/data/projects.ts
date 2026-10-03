import { ProjectDifficulty, ProjectSource } from '../../models/Project';

export interface SeedProjectSkillGain {
  skillSlug: string;
  levelGain: number;
}

export interface SeedProject {
  slug: string;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  source: ProjectSource;
  estimatedHours: number;
  skillSlugs: string[];
  careerSlugs: string[];
  deliverables: string[];
  skillLevelsGained: SeedProjectSkillGain[];
}

export const projectsData: SeedProject[] = [
  {
    slug: 'student-task-manager-api',
    title: 'RESTful Task & Study Tracker API',
    description: 'Design and build a complete REST API using Express, TypeScript, and MongoDB with pagination, input validation, and clean error handling.',
    difficulty: 'beginner',
    source: 'catalog',
    estimatedHours: 20,
    skillSlugs: ['typescript', 'node-express', 'rest-api-design', 'nosql-mongodb'],
    careerSlugs: ['backend-engineer'],
    deliverables: [
      'Documented REST endpoints with OpenAPI / Postman collection',
      'Mongoose schema with data validation and pagination',
      'Automated integration tests verifying status codes and error responses'
    ],
    skillLevelsGained: [
      { skillSlug: 'node-express', levelGain: 1 },
      { skillSlug: 'rest-api-design', levelGain: 1 }
    ]
  },
  {
    slug: 'student-academic-analytics-dashboard',
    title: 'Student Academic Performance Analytics',
    description: 'Analyze student retention, grade distributions, and study time trends using Pandas, computing statistical hypothesis tests and rendering interactive visual charts.',
    difficulty: 'beginner',
    source: 'catalog',
    estimatedHours: 25,
    skillSlugs: ['python', 'data-analysis-pandas', 'data-visualization', 'statistics-probability'],
    careerSlugs: ['data-scientist'],
    deliverables: [
      'Jupyter notebook with end-to-end exploratory data analysis (EDA)',
      'Cleaned dataset handling missing values and outliers',
      'Visual charts highlighting key demographic and performance insights'
    ],
    skillLevelsGained: [
      { skillSlug: 'data-analysis-pandas', levelGain: 1 },
      { skillSlug: 'data-visualization', levelGain: 1 }
    ]
  },
  {
    slug: 'cloud-static-website-terraform',
    title: 'Multi-Environment AWS Infrastructure with Terraform',
    description: 'Automate the provisioning of AWS S3 static hosting, CloudFront CDN distribution, Route53 DNS, and SSL certificates using modular Terraform scripts.',
    difficulty: 'beginner',
    source: 'catalog',
    estimatedHours: 18,
    skillSlugs: ['cloud-fundamentals', 'aws-services', 'infrastructure-as-code'],
    careerSlugs: ['cloud-engineer'],
    deliverables: [
      'Declarative Terraform scripts with dev/prod environment configurations',
      'Configured CloudFront distribution with HTTPS redirection',
      'Automated deployment execution with clean terraform destroy instructions'
    ],
    skillLevelsGained: [
      { skillSlug: 'cloud-fundamentals', levelGain: 1 },
      { skillSlug: 'aws-services', levelGain: 1 }
    ]
  },
  {
    slug: 'customer-churn-prediction-engine',
    title: 'Customer Churn Predictor with Model Explainability',
    description: 'Train supervised machine learning models to forecast customer attrition, optimize hyperparameters using cross-validation, and interpret feature importance with SHAP values.',
    difficulty: 'intermediate',
    source: 'catalog',
    estimatedHours: 35,
    skillSlugs: ['python', 'machine-learning', 'statistics-probability', 'data-analysis-pandas'],
    careerSlugs: ['data-scientist', 'ai-engineer'],
    deliverables: [
      'Scikit-learn model pipeline with ROC-AUC, precision, and recall evaluations',
      'Feature engineering and correlation matrix analysis',
      'SHAP summary visualizations explaining top risk indicators'
    ],
    skillLevelsGained: [
      { skillSlug: 'machine-learning', levelGain: 1 },
      { skillSlug: 'statistics-probability', levelGain: 1 }
    ]
  },
  {
    slug: 'realtime-financial-market-data-pipeline',
    title: 'Real-Time Market Ingestion & Streaming ETL Pipeline',
    description: 'Build an event-driven data pipeline that consumes real-time stock/crypto feeds into Kafka, processes batch transformations, and loads clean records into an analytical SQL warehouse.',
    difficulty: 'intermediate',
    source: 'catalog',
    estimatedHours: 40,
    skillSlugs: ['python', 'sql', 'etl-pipeline-design', 'stream-processing-kafka', 'data-warehousing'],
    careerSlugs: ['data-engineer'],
    deliverables: [
      'Kafka producer & consumer pipeline handling event streams with retry logic',
      'PostgreSQL / DuckDB analytical data warehouse schema with star schema tables',
      'Data verification script checking pipeline ingestion latency and idempotency'
    ],
    skillLevelsGained: [
      { skillSlug: 'etl-pipeline-design', levelGain: 1 },
      { skillSlug: 'stream-processing-kafka', levelGain: 1 }
    ]
  },
  {
    slug: 'automated-web-vulnerability-scanner',
    title: 'Automated OWASP Security & HTTP Header Auditor',
    description: 'Develop a CLI-based defensive security scanner that audits web servers for missing security headers, outdated SSL ciphers, and common OWASP vulnerabilities like SQL injection flaws.',
    difficulty: 'intermediate',
    source: 'catalog',
    estimatedHours: 30,
    skillSlugs: ['python', 'cybersecurity-fundamentals', 'web-app-security-owasp', 'computer-networking'],
    careerSlugs: ['cybersecurity-engineer'],
    deliverables: [
      'Command-line scanner script that tests target URLs against security checklists',
      'Detailed audit report generation with severity ratings and remediation guidance',
      'Defensive validation suite confirming test coverage across HTTP headers'
    ],
    skillLevelsGained: [
      { skillSlug: 'web-app-security-owasp', levelGain: 1 },
      { skillSlug: 'cybersecurity-fundamentals', levelGain: 1 }
    ]
  },
  {
    slug: 'production-ecommerce-backend-system',
    title: 'High-Throughput E-Commerce Backend & Ordering Service',
    description: 'Architect a scalable backend with Express, TypeScript, PostgreSQL, and Docker. Implements JWT authentication, rate limiting, and ACID transactions for stock reservation.',
    difficulty: 'intermediate',
    source: 'catalog',
    estimatedHours: 45,
    skillSlugs: ['typescript', 'node-express', 'sql', 'authentication-security', 'docker-containers', 'system-design'],
    careerSlugs: ['backend-engineer'],
    deliverables: [
      'Multi-container docker-compose setup containing the API and database',
      'Atomic SQL transaction handling to prevent overselling inventory',
      'Role-based middleware protecting customer and admin management routes'
    ],
    skillLevelsGained: [
      { skillSlug: 'system-design', levelGain: 1 },
      { skillSlug: 'sql', levelGain: 1 },
      { skillSlug: 'authentication-security', levelGain: 1 }
    ]
  },
  {
    slug: 'rag-knowledge-assistant-llm',
    title: 'Enterprise Document Q&A Assistant via RAG & Vector Search',
    description: 'Build an end-to-end Retrieval-Augmented Generation (RAG) system that parses PDF documentation, generates embeddings, stores vectors in Chroma/Qdrant, and generates grounded answers.',
    difficulty: 'advanced',
    source: 'catalog',
    estimatedHours: 50,
    skillSlugs: ['python', 'nlp-llms', 'deep-learning', 'rest-api-design', 'docker-containers', 'mlops'],
    careerSlugs: ['ai-engineer'],
    deliverables: [
      'Chunking and embedding ingestion pipeline with vector index persistence',
      'FastAPI / Express query endpoint with citation tracking to prevent hallucinations',
      'Evaluation notebook measuring retrieval recall and answer relevance'
    ],
    skillLevelsGained: [
      { skillSlug: 'nlp-llms', levelGain: 1 },
      { skillSlug: 'mlops', levelGain: 1 }
    ]
  },
  {
    slug: 'distributed-large-scale-clickstream-pipeline',
    title: 'Distributed Clickstream Analytics with Apache Spark',
    description: 'Process gigabytes of user interaction clickstream logs across a simulated cluster using PySpark, performing windowed aggregations, sessionization, and loading to a cloud warehouse.',
    difficulty: 'advanced',
    source: 'catalog',
    estimatedHours: 55,
    skillSlugs: ['distributed-computing-spark', 'data-warehousing', 'etl-pipeline-design', 'sql', 'aws-services'],
    careerSlugs: ['data-engineer'],
    deliverables: [
      'PySpark job scripts with optimized broadcast joins and partitioned output',
      'Dimensional warehouse tables tracking active sessions, bounce rates, and conversions',
      'Benchmark report comparing local vs. cluster execution runtimes'
    ],
    skillLevelsGained: [
      { skillSlug: 'distributed-computing-spark', levelGain: 1 },
      { skillSlug: 'data-warehousing', levelGain: 1 }
    ]
  },
  {
    slug: 'zero-trust-cloud-infrastructure-k8s',
    title: 'Zero-Trust Kubernetes Cluster with Automated CI/CD',
    description: 'Deploy a multi-tier microservice architecture into a Kubernetes cluster with NetworkPolicies, mTLS, secret management via Vault/SealedSecrets, and automated GitHub Actions CI/CD.',
    difficulty: 'advanced',
    source: 'catalog',
    estimatedHours: 50,
    skillSlugs: ['kubernetes-orchestration', 'docker-containers', 'ci-cd-pipelines', 'aws-services', 'network-security'],
    careerSlugs: ['cloud-engineer', 'cybersecurity-engineer'],
    deliverables: [
      'Kubernetes manifest repository with ingress controllers and NetworkPolicy rules',
      'GitHub Actions workflow with container vulnerability scanning and deployment stages',
      'Security audit report verifying isolated inter-namespace pod communication'
    ],
    skillLevelsGained: [
      { skillSlug: 'kubernetes-orchestration', levelGain: 1 },
      { skillSlug: 'ci-cd-pipelines', levelGain: 1 }
    ]
  }
];
