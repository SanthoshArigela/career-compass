import { ResourceType, ResourceLevel } from '../../models/Resource';

export interface SeedResource {
  slug: string;
  title: string;
  url: string;
  provider: string;
  type: ResourceType;
  skillSlugs: string[];
  level: ResourceLevel;
  levelGranted: number;
  durationHours: number;
  cost: number;
}

export const resourcesData: SeedResource[] = [
  {
    slug: 'python-official-tutorial',
    title: 'The Python Tutorial (Official Docs)',
    url: 'https://docs.python.org/3/tutorial/',
    provider: 'Python Software Foundation',
    type: 'documentation',
    skillSlugs: ['python'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 15,
    cost: 0
  },
  {
    slug: 'cs50-introduction-computer-science',
    title: 'CS50x: Introduction to Computer Science',
    url: 'https://cs50.harvard.edu/x/',
    provider: 'Harvard University',
    type: 'course',
    skillSlugs: ['python', 'data-structures-algorithms', 'sql'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 60,
    cost: 0
  },
  {
    slug: 'typescript-handbook',
    title: 'The TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    provider: 'Microsoft',
    type: 'documentation',
    skillSlugs: ['typescript', 'javascript'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 20,
    cost: 0
  },
  {
    slug: 'mdn-javascript-guide',
    title: 'MDN Web Docs: JavaScript Guide',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    provider: 'Mozilla Developer Network',
    type: 'documentation',
    skillSlugs: ['javascript'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 25,
    cost: 0
  },
  {
    slug: 'nodejs-official-learn',
    title: 'Node.js Architecture & Guides',
    url: 'https://nodejs.org/en/learn',
    provider: 'Node.js Foundation',
    type: 'documentation',
    skillSlugs: ['node-express', 'rest-api-design'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 20,
    cost: 0
  },
  {
    slug: 'postgres-tutorial',
    title: 'PostgreSQL Tutorial & Relational Database Design',
    url: 'https://www.postgresqltutorial.com/',
    provider: 'PostgreSQL Tutorial',
    type: 'tutorial',
    skillSlugs: ['sql'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 18,
    cost: 0
  },
  {
    slug: 'mongodb-university-basics',
    title: 'MongoDB Basics & Aggregations',
    url: 'https://learn.mongodb.com/',
    provider: 'MongoDB University',
    type: 'course',
    skillSlugs: ['nosql-mongodb'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 15,
    cost: 0
  },
  {
    slug: 'system-design-primer',
    title: 'The System Design Primer',
    url: 'https://github.com/donnemartin/system-design-primer',
    provider: 'GitHub Open Source',
    type: 'article',
    skillSlugs: ['system-design'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 35,
    cost: 0
  },
  {
    slug: 'kaggle-pandas-data-manipulation',
    title: 'Kaggle: Pandas & Data Manipulation',
    url: 'https://www.kaggle.com/learn/pandas',
    provider: 'Kaggle',
    type: 'practice',
    skillSlugs: ['data-analysis-pandas', 'python'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 8,
    cost: 0
  },
  {
    slug: 'google-machine-learning-crash-course',
    title: 'Google Machine Learning Crash Course',
    url: 'https://developers.google.com/machine-learning/crash-course',
    provider: 'Google',
    type: 'course',
    skillSlugs: ['machine-learning', 'statistics-probability'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 25,
    cost: 0
  },
  {
    slug: 'fastai-practical-deep-learning',
    title: 'Practical Deep Learning for Coders',
    url: 'https://course.fast.ai/',
    provider: 'fast.ai',
    type: 'course',
    skillSlugs: ['deep-learning', 'machine-learning'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 40,
    cost: 0
  },
  {
    slug: 'huggingface-nlp-course',
    title: 'Hugging Face NLP & Transformers Course',
    url: 'https://huggingface.co/learn/nlp-course/',
    provider: 'Hugging Face',
    type: 'tutorial',
    skillSlugs: ['nlp-llms', 'deep-learning'],
    level: 'intermediate',
    levelGranted: 4,
    durationHours: 30,
    cost: 0
  },
  {
    slug: 'aws-cloud-practitioner-essentials',
    title: 'AWS Cloud Practitioner Essentials',
    url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    provider: 'Amazon Web Services',
    type: 'course',
    skillSlugs: ['cloud-fundamentals', 'aws-services'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 12,
    cost: 0
  },
  {
    slug: 'docker-getting-started-guide',
    title: 'Docker Official Getting Started Guide',
    url: 'https://docs.docker.com/get-started/',
    provider: 'Docker',
    type: 'documentation',
    skillSlugs: ['docker-containers', 'bash-linux'],
    level: 'beginner',
    levelGranted: 2,
    durationHours: 10,
    cost: 0
  },
  {
    slug: 'kubernetes-basics-tutorial',
    title: 'Kubernetes Interactive Basics & Tutorials',
    url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
    provider: 'Cloud Native Computing Foundation',
    type: 'documentation',
    skillSlugs: ['kubernetes-orchestration'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 20,
    cost: 0
  },
  {
    slug: 'hashicorp-terraform-associate-tutorials',
    title: 'HashiCorp Learn: Terraform on AWS',
    url: 'https://developer.hashicorp.com/terraform/tutorials',
    provider: 'HashiCorp',
    type: 'tutorial',
    skillSlugs: ['infrastructure-as-code', 'aws-services'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 16,
    cost: 0
  },
  {
    slug: 'owasp-top-10-guidelines',
    title: 'OWASP Top 10 Security Vulnerabilities & Mitigations',
    url: 'https://owasp.org/www-project-top-ten/',
    provider: 'OWASP Foundation',
    type: 'documentation',
    skillSlugs: ['web-app-security-owasp', 'authentication-security'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 15,
    cost: 0
  },
  {
    slug: 'apache-spark-pyspark-quickstart',
    title: 'Apache Spark Quick Start & PySpark Architecture',
    url: 'https://spark.apache.org/docs/latest/quick-start.html',
    provider: 'Apache Software Foundation',
    type: 'documentation',
    skillSlugs: ['distributed-computing-spark', 'etl-pipeline-design'],
    level: 'intermediate',
    levelGranted: 3,
    durationHours: 18,
    cost: 0
  }
];
