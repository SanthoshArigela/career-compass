export interface SeedSkill {
  slug: string;
  name: string;
  category: string;
  description: string;
  prerequisiteSlugs: string[];
  hoursPerLevel: number;
}

export const skillsData: SeedSkill[] = [
  // Programming
  {
    slug: 'python',
    name: 'Python Programming',
    category: 'Programming',
    description: 'General-purpose programming in Python, including standard libraries, data structures, and OOP.',
    prerequisiteSlugs: [],
    hoursPerLevel: 20
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    category: 'Programming',
    description: 'Modern JavaScript (ES6+), async/await, closures, promises, and the Node.js event loop.',
    prerequisiteSlugs: [],
    hoursPerLevel: 20
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
    category: 'Programming',
    description: 'Statically typed superset of JavaScript with strict interfaces, generics, and compiler tooling.',
    prerequisiteSlugs: ['javascript'],
    hoursPerLevel: 20
  },
  {
    slug: 'sql',
    name: 'SQL & Relational Databases',
    category: 'Databases',
    description: 'Querying, joins, indexing, transactions, and schema normalization in relational database systems.',
    prerequisiteSlugs: [],
    hoursPerLevel: 15
  },
  {
    slug: 'bash-linux',
    name: 'Linux & Shell Scripting',
    category: 'Tools',
    description: 'Command line navigation, process management, shell scripting, file permissions, and environment setup.',
    prerequisiteSlugs: [],
    hoursPerLevel: 15
  },

  // Computer Science Core
  {
    slug: 'data-structures-algorithms',
    name: 'Data Structures & Algorithms',
    category: 'Software Engineering',
    description: 'Arrays, hash maps, trees, graphs, sorting, searching, recursion, and Big-O computational complexity.',
    prerequisiteSlugs: ['python'],
    hoursPerLevel: 30
  },
  {
    slug: 'computer-networking',
    name: 'Computer Networking',
    category: 'Infrastructure',
    description: 'TCP/IP stack, DNS, HTTP/HTTPS protocols, sockets, routing, firewalls, and network latency.',
    prerequisiteSlugs: [],
    hoursPerLevel: 20
  },

  // Backend & Systems
  {
    slug: 'rest-api-design',
    name: 'RESTful API Design',
    category: 'Backend',
    description: 'REST architecture principles, resource modeling, HTTP status codes, versioning, and validation.',
    prerequisiteSlugs: ['javascript'],
    hoursPerLevel: 15
  },
  {
    slug: 'node-express',
    name: 'Node.js & Express Architecture',
    category: 'Backend',
    description: 'Server-side Node.js development, Express middleware patterns, routing, and asynchronous IO.',
    prerequisiteSlugs: ['javascript', 'rest-api-design'],
    hoursPerLevel: 20
  },
  {
    slug: 'system-design',
    name: 'System Design & Scalability',
    category: 'Software Engineering',
    description: 'High-availability architectures, load balancing, caching, partitioning, CAP theorem, and rate limiting.',
    prerequisiteSlugs: ['rest-api-design', 'sql'],
    hoursPerLevel: 30
  },
  {
    slug: 'nosql-mongodb',
    name: 'MongoDB & Document Databases',
    category: 'Databases',
    description: 'Document data modeling, aggregation pipelines, schema validation, indexing, and Mongoose ORM.',
    prerequisiteSlugs: ['sql'],
    hoursPerLevel: 15
  },
  {
    slug: 'authentication-security',
    name: 'Authentication & Web Security',
    category: 'Security',
    description: 'JWT tokens, OAuth2, session management, password hashing, CORS, and role-based access control.',
    prerequisiteSlugs: ['rest-api-design'],
    hoursPerLevel: 15
  },

  // Data & Machine Learning
  {
    slug: 'statistics-probability',
    name: 'Statistics & Probability',
    category: 'Data',
    description: 'Descriptive and inferential statistics, hypothesis testing, distributions, regression, and Bayes theorem.',
    prerequisiteSlugs: [],
    hoursPerLevel: 25
  },
  {
    slug: 'data-analysis-pandas',
    name: 'Data Analysis with Pandas & NumPy',
    category: 'Data',
    description: 'Data manipulation, vectorized operations, missing value handling, and exploratory data analysis.',
    prerequisiteSlugs: ['python'],
    hoursPerLevel: 20
  },
  {
    slug: 'data-visualization',
    name: 'Data Visualization',
    category: 'Data',
    description: 'Communicating insights visually with Matplotlib, Seaborn, interactive dashboards, and storytelling.',
    prerequisiteSlugs: ['python'],
    hoursPerLevel: 15
  },
  {
    slug: 'machine-learning',
    name: 'Machine Learning Algorithms',
    category: 'Machine Learning',
    description: 'Supervised and unsupervised learning, Scikit-Learn, cross-validation, feature engineering, and metrics.',
    prerequisiteSlugs: ['python', 'statistics-probability', 'data-analysis-pandas'],
    hoursPerLevel: 30
  },
  {
    slug: 'deep-learning',
    name: 'Deep Learning & Neural Networks',
    category: 'Machine Learning',
    description: 'PyTorch/TensorFlow, multi-layer perceptrons, CNNs, RNNs, transformers, and backpropagation.',
    prerequisiteSlugs: ['machine-learning'],
    hoursPerLevel: 35
  },
  {
    slug: 'nlp-llms',
    name: 'Natural Language Processing & LLMs',
    category: 'Machine Learning',
    description: 'Text preprocessing, tokenization, embeddings, fine-tuning, prompt engineering, and LLM orchestration.',
    prerequisiteSlugs: ['deep-learning'],
    hoursPerLevel: 30
  },
  {
    slug: 'mlops',
    name: 'MLOps & Model Deployment',
    category: 'Machine Learning',
    description: 'Model versioning, experiment tracking (MLflow), serving inference APIs, monitoring data drift.',
    prerequisiteSlugs: ['machine-learning'],
    hoursPerLevel: 25
  },

  // Data Engineering
  {
    slug: 'data-warehousing',
    name: 'Data Warehousing & Dimensional Modeling',
    category: 'Data',
    description: 'Star/snowflake schemas, OLAP vs OLTP, column-oriented storage, Snowflake/BigQuery principles.',
    prerequisiteSlugs: ['sql'],
    hoursPerLevel: 20
  },
  {
    slug: 'etl-pipeline-design',
    name: 'ETL & Pipeline Orchestration',
    category: 'Data',
    description: 'Batch and micro-batch data pipelines, workflow orchestration with Airflow, data quality validation.',
    prerequisiteSlugs: ['python', 'sql'],
    hoursPerLevel: 25
  },
  {
    slug: 'distributed-computing-spark',
    name: 'Distributed Computing with Apache Spark',
    category: 'Data',
    description: 'PySpark, distributed DataFrame processing, partitioning, shuffle operations, and cluster computing.',
    prerequisiteSlugs: ['python', 'etl-pipeline-design'],
    hoursPerLevel: 30
  },
  {
    slug: 'stream-processing-kafka',
    name: 'Event Streaming with Apache Kafka',
    category: 'Data',
    description: 'Publish-subscribe messaging, topics, consumer groups, Kafka Streams, and real-time event ingest.',
    prerequisiteSlugs: ['etl-pipeline-design'],
    hoursPerLevel: 25
  },

  // Cloud & DevOps
  {
    slug: 'cloud-fundamentals',
    name: 'Cloud Computing Fundamentals',
    category: 'Cloud',
    description: 'IaaS, PaaS, SaaS, virtualization, shared responsibility model, regions/zones, and cloud economics.',
    prerequisiteSlugs: ['computer-networking'],
    hoursPerLevel: 15
  },
  {
    slug: 'aws-services',
    name: 'AWS Cloud Architecture',
    category: 'Cloud',
    description: 'Core AWS services including EC2, S3, RDS, Lambda, VPC networking, IAM security policies, and CloudWatch.',
    prerequisiteSlugs: ['cloud-fundamentals'],
    hoursPerLevel: 25
  },
  {
    slug: 'docker-containers',
    name: 'Docker & Containerization',
    category: 'DevOps',
    description: 'Building multi-stage container images, Dockerfiles, docker-compose, and container isolation.',
    prerequisiteSlugs: ['bash-linux'],
    hoursPerLevel: 20
  },
  {
    slug: 'kubernetes-orchestration',
    name: 'Kubernetes Container Orchestration',
    category: 'DevOps',
    description: 'Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, cluster autoscaling, and helm charts.',
    prerequisiteSlugs: ['docker-containers'],
    hoursPerLevel: 30
  },
  {
    slug: 'ci-cd-pipelines',
    name: 'CI/CD Pipelines & Automation',
    category: 'DevOps',
    description: 'Continuous integration, GitHub Actions, automated testing, semantic versioning, and zero-downtime deployment.',
    prerequisiteSlugs: ['docker-containers'],
    hoursPerLevel: 15
  },
  {
    slug: 'infrastructure-as-code',
    name: 'Infrastructure as Code (Terraform)',
    category: 'Cloud',
    description: 'Declarative cloud provisioning using Terraform (HCL), state management, modules, and drifts.',
    prerequisiteSlugs: ['cloud-fundamentals'],
    hoursPerLevel: 20
  },

  // Security
  {
    slug: 'cybersecurity-fundamentals',
    name: 'Cybersecurity Fundamentals',
    category: 'Security',
    description: 'CIA triad, threat modeling, attack surfaces, vulnerability scanning, security audits, and compliance.',
    prerequisiteSlugs: ['computer-networking'],
    hoursPerLevel: 20
  },
  {
    slug: 'network-security',
    name: 'Network Security & Threat Detection',
    category: 'Security',
    description: 'Intrusion detection (IDS/IPS), packet analysis with Wireshark, VPNs, TLS handshakes, and perimeter defenses.',
    prerequisiteSlugs: ['computer-networking', 'cybersecurity-fundamentals'],
    hoursPerLevel: 25
  },
  {
    slug: 'web-app-security-owasp',
    name: 'Web Application Security (OWASP)',
    category: 'Security',
    description: 'OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF, IDOR), mitigation strategies, and secure coding practices.',
    prerequisiteSlugs: ['rest-api-design', 'cybersecurity-fundamentals'],
    hoursPerLevel: 20
  },
  {
    slug: 'cryptography',
    name: 'Applied Cryptography & PKI',
    category: 'Security',
    description: 'Symmetric & asymmetric encryption, cryptographic hashing (SHA-256), digital signatures, and SSL certificates.',
    prerequisiteSlugs: ['cybersecurity-fundamentals'],
    hoursPerLevel: 20
  },

  // Tools
  {
    slug: 'git-github',
    name: 'Git & Version Control',
    category: 'Tools',
    description: 'Branching strategies, pull requests, merge conflict resolution, rebasing, and open-source collaboration.',
    prerequisiteSlugs: [],
    hoursPerLevel: 10
  }
];
