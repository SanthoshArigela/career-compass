export interface SeedCareerSkill {
  skillSlug: string;
  requiredLevel: number;
  importance: number;
}

export interface SeedCareer {
  slug: string;
  title: string;
  summary: string;
  dayInLife: string;
  category: string;
  interestTags: string[];
  requiredSkills: SeedCareerSkill[];
  entryRoutes: string[];
}

export const careersData: SeedCareer[] = [
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    summary: 'Designs, fine-tunes, and deploys intelligent systems, LLM pipelines, and deep learning models into production applications.',
    dayInLife: 'Analyzes model performance, implements retrieval-augmented generation (RAG) pipelines, builds prompt orchestrations, and optimizes inference latency with backend teams.',
    category: 'Artificial Intelligence',
    interestTags: ['machine-learning', 'generative-ai', 'deep-learning', 'python', 'automation'],
    requiredSkills: [
      { skillSlug: 'python', requiredLevel: 4, importance: 3 },
      { skillSlug: 'machine-learning', requiredLevel: 4, importance: 3 },
      { skillSlug: 'deep-learning', requiredLevel: 4, importance: 3 },
      { skillSlug: 'nlp-llms', requiredLevel: 4, importance: 3 },
      { skillSlug: 'statistics-probability', requiredLevel: 3, importance: 2 },
      { skillSlug: 'data-analysis-pandas', requiredLevel: 3, importance: 2 },
      { skillSlug: 'mlops', requiredLevel: 3, importance: 2 },
      { skillSlug: 'docker-containers', requiredLevel: 3, importance: 2 },
      { skillSlug: 'rest-api-design', requiredLevel: 3, importance: 1 },
      { skillSlug: 'git-github', requiredLevel: 3, importance: 1 }
    ],
    entryRoutes: [
      'Junior AI/ML Developer after building end-to-end LLM/NLP portfolio projects',
      'Transition from Software Engineer through applied ML engineering courses',
      'AI Research Assistant or Data Science graduate program entry'
    ]
  },
  {
    slug: 'backend-engineer',
    title: 'Backend Engineer',
    summary: 'Architects robust server-side APIs, database schemas, and microservices that power mission-critical web applications.',
    dayInLife: 'Writes performant endpoints, manages database migrations, debugs distributed latency, implements authentication, and designs modular software architecture.',
    category: 'Software Engineering',
    interestTags: ['backend', 'databases', 'apis', 'system-design', 'cloud'],
    requiredSkills: [
      { skillSlug: 'typescript', requiredLevel: 4, importance: 3 },
      { skillSlug: 'node-express', requiredLevel: 4, importance: 3 },
      { skillSlug: 'rest-api-design', requiredLevel: 4, importance: 3 },
      { skillSlug: 'sql', requiredLevel: 4, importance: 3 },
      { skillSlug: 'system-design', requiredLevel: 3, importance: 3 },
      { skillSlug: 'nosql-mongodb', requiredLevel: 3, importance: 2 },
      { skillSlug: 'authentication-security', requiredLevel: 3, importance: 2 },
      { skillSlug: 'docker-containers', requiredLevel: 3, importance: 2 },
      { skillSlug: 'data-structures-algorithms', requiredLevel: 3, importance: 2 },
      { skillSlug: 'ci-cd-pipelines', requiredLevel: 2, importance: 1 },
      { skillSlug: 'git-github', requiredLevel: 3, importance: 1 }
    ],
    entryRoutes: [
      'Junior Backend Engineer / Node.js Developer through portfolio projects & internships',
      'Full Stack Developer transitioning to backend systems specialization',
      'Open-source contributor to popular backend frameworks and tooling'
    ]
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    summary: 'Extracts actionable business insights and predictive power from complex datasets using statistics, visualization, and machine learning.',
    dayInLife: 'Explores noisy datasets, crafts feature engineering pipelines, performs statistical A/B testing, builds predictive models, and presents findings to business stakeholders.',
    category: 'Data Science',
    interestTags: ['data-science', 'statistics', 'predictive-modeling', 'analytics', 'visualization'],
    requiredSkills: [
      { skillSlug: 'python', requiredLevel: 4, importance: 3 },
      { skillSlug: 'statistics-probability', requiredLevel: 4, importance: 3 },
      { skillSlug: 'machine-learning', requiredLevel: 4, importance: 3 },
      { skillSlug: 'data-analysis-pandas', requiredLevel: 4, importance: 3 },
      { skillSlug: 'data-visualization', requiredLevel: 3, importance: 2 },
      { skillSlug: 'sql', requiredLevel: 3, importance: 2 },
      { skillSlug: 'deep-learning', requiredLevel: 3, importance: 2 },
      { skillSlug: 'data-structures-algorithms', requiredLevel: 2, importance: 1 },
      { skillSlug: 'git-github', requiredLevel: 2, importance: 1 }
    ],
    entryRoutes: [
      'Junior Data Analyst stepping up with Kaggle competitions and ML portfolios',
      'STEM graduate (Mathematics, Physics, Computer Science) with applied statistical projects',
      'Business Intelligence Analyst moving into predictive machine learning'
    ]
  },
  {
    slug: 'data-engineer',
    title: 'Data Engineer',
    summary: 'Constructs the resilient infrastructure, pipelines, and data warehouses needed to ingest, clean, and transform massive streams of raw data.',
    dayInLife: 'Builds Apache Airflow DAGs, writes PySpark transformations on distributed clusters, optimizes SQL warehouse queries, and monitors data pipeline SLAs.',
    category: 'Data Engineering',
    interestTags: ['big-data', 'data-pipelines', 'etl', 'sql', 'streaming'],
    requiredSkills: [
      { skillSlug: 'sql', requiredLevel: 4, importance: 3 },
      { skillSlug: 'python', requiredLevel: 4, importance: 3 },
      { skillSlug: 'etl-pipeline-design', requiredLevel: 4, importance: 3 },
      { skillSlug: 'data-warehousing', requiredLevel: 4, importance: 3 },
      { skillSlug: 'distributed-computing-spark', requiredLevel: 3, importance: 3 },
      { skillSlug: 'stream-processing-kafka', requiredLevel: 3, importance: 2 },
      { skillSlug: 'cloud-fundamentals', requiredLevel: 3, importance: 2 },
      { skillSlug: 'docker-containers', requiredLevel: 3, importance: 2 },
      { skillSlug: 'bash-linux', requiredLevel: 3, importance: 2 },
      { skillSlug: 'git-github', requiredLevel: 3, importance: 1 }
    ],
    entryRoutes: [
      'Database Administrator or SQL Developer transitioning into Big Data and Spark',
      'Junior Software Engineer specializing in backend data flows and pipelines',
      'Data Analyst with strong Python and ETL engineering capabilities'
    ]
  },
  {
    slug: 'cloud-engineer',
    title: 'Cloud Engineer',
    summary: 'Designs, deploys, and maintains reliable, automated, and secure multi-region cloud infrastructure using code and containers.',
    dayInLife: 'Provisions cloud resources via Terraform, maintains Kubernetes clusters, tunes auto-scaling policies, audits security groups, and maintains deployment pipelines.',
    category: 'Cloud & Infrastructure',
    interestTags: ['cloud', 'aws', 'devops', 'kubernetes', 'terraform'],
    requiredSkills: [
      { skillSlug: 'cloud-fundamentals', requiredLevel: 4, importance: 3 },
      { skillSlug: 'aws-services', requiredLevel: 4, importance: 3 },
      { skillSlug: 'infrastructure-as-code', requiredLevel: 4, importance: 3 },
      { skillSlug: 'docker-containers', requiredLevel: 4, importance: 3 },
      { skillSlug: 'kubernetes-orchestration', requiredLevel: 3, importance: 2 },
      { skillSlug: 'computer-networking', requiredLevel: 3, importance: 2 },
      { skillSlug: 'bash-linux', requiredLevel: 3, importance: 2 },
      { skillSlug: 'ci-cd-pipelines', requiredLevel: 3, importance: 2 },
      { skillSlug: 'python', requiredLevel: 2, importance: 1 },
      { skillSlug: 'git-github', requiredLevel: 3, importance: 1 }
    ],
    entryRoutes: [
      'Systems Administrator or DevOps Intern with AWS Certified Solutions Architect credential',
      'Junior Developer with strong containerization, Terraform, and CI/CD interest',
      'Network Engineer moving into software-defined cloud networking'
    ]
  },
  {
    slug: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    summary: 'Protects enterprise digital assets, cloud networks, and software applications from cyber threats, vulnerabilities, and unauthorized access.',
    dayInLife: 'Conducts vulnerability assessments, reviews application code against OWASP guidelines, analyzes suspicious network packet captures, and configures IAM policies.',
    category: 'Cybersecurity',
    interestTags: ['security', 'network-defense', 'cryptography', 'owasp', 'penetration-testing'],
    requiredSkills: [
      { skillSlug: 'cybersecurity-fundamentals', requiredLevel: 4, importance: 3 },
      { skillSlug: 'network-security', requiredLevel: 4, importance: 3 },
      { skillSlug: 'computer-networking', requiredLevel: 4, importance: 3 },
      { skillSlug: 'web-app-security-owasp', requiredLevel: 4, importance: 3 },
      { skillSlug: 'cryptography', requiredLevel: 3, importance: 2 },
      { skillSlug: 'authentication-security', requiredLevel: 3, importance: 2 },
      { skillSlug: 'bash-linux', requiredLevel: 3, importance: 2 },
      { skillSlug: 'python', requiredLevel: 3, importance: 2 },
      { skillSlug: 'cloud-fundamentals', requiredLevel: 2, importance: 1 },
      { skillSlug: 'git-github', requiredLevel: 2, importance: 1 }
    ],
    entryRoutes: [
      'SOC (Security Operations Center) Analyst level 1 stepping into engineering roles',
      'Computer Science graduate with CTF (Capture The Flag) competitions and Security+ certification',
      'Network Administrator specializing in defensive perimeter security and incident response'
    ]
  }
];
