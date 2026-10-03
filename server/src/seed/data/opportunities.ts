import { OpportunityType } from '../../models/Opportunity';

export interface SeedOpportunity {
  slug: string;
  title: string;
  organization: string;
  type: OpportunityType;
  url: string;
  deadline: Date | null;
  location: string | null;
  remote: boolean;
  careerSlugs: string[];
  skillSlugs: string[];
  minSkillLevel: number;
  description: string;
}

export const opportunitiesData: SeedOpportunity[] = [
  {
    slug: 'mlh-fellowship-open-source',
    title: 'MLH Fellowship: Open Source Software',
    organization: 'Major League Hacking',
    type: 'fellowship',
    url: 'https://fellowship.mlh.io/',
    deadline: null,
    location: 'Global',
    remote: true,
    careerSlugs: ['backend-engineer', 'cloud-engineer'],
    skillSlugs: ['git-github', 'typescript', 'python'],
    minSkillLevel: 2,
    description: 'A 12-week remote internship alternative where students contribute to high-impact open-source software with mentorship from senior engineers.'
  },
  {
    slug: 'google-summer-of-code',
    title: 'Google Summer of Code (GSoC)',
    organization: 'Google',
    type: 'fellowship',
    url: 'https://summerofcode.withgoogle.com/',
    deadline: null,
    location: 'Global',
    remote: true,
    careerSlugs: ['backend-engineer', 'ai-engineer', 'data-engineer'],
    skillSlugs: ['python', 'git-github', 'data-structures-algorithms'],
    minSkillLevel: 2,
    description: 'An international program introducing student developers to open source software development through stipended mentorship projects with leading organizations.'
  },
  {
    slug: 'calhacks-collegiate-hackathon',
    title: 'Cal Hacks Collegiate Hackathon',
    organization: 'Cal Hacks',
    type: 'hackathon',
    url: 'https://calhacks.io/',
    deadline: null,
    location: 'San Francisco, CA',
    remote: false,
    careerSlugs: ['ai-engineer', 'backend-engineer', 'cloud-engineer'],
    skillSlugs: ['python', 'typescript', 'rest-api-design'],
    minSkillLevel: 1,
    description: 'The world’s largest collegiate hackathon hosted at UC Berkeley, gathering 2,000+ passionate student hackers to build innovative tech.'
  },
  {
    slug: 'microsoft-explore-internship',
    title: 'Microsoft Explore Internship Program',
    organization: 'Microsoft',
    type: 'internship',
    url: 'https://careers.microsoft.com/students/us/en/job/explore-program',
    deadline: null,
    location: 'Redmond, WA',
    remote: false,
    careerSlugs: ['backend-engineer', 'data-scientist'],
    skillSlugs: ['data-structures-algorithms', 'python', 'sql'],
    minSkillLevel: 1,
    description: 'A rotational 12-week summer internship for first and second-year college students exploring software engineering and program management.'
  },
  {
    slug: 'kaggle-tabular-playground-series',
    title: 'Kaggle Tabular Playground Series ML Competition',
    organization: 'Kaggle',
    type: 'competition',
    url: 'https://www.kaggle.com/competitions',
    deadline: null,
    location: 'Global',
    remote: true,
    careerSlugs: ['data-scientist', 'ai-engineer'],
    skillSlugs: ['python', 'machine-learning', 'data-analysis-pandas'],
    minSkillLevel: 2,
    description: 'Monthly machine learning competition designed for students and practitioners to hone their feature engineering and predictive modeling skills.'
  },
  {
    slug: 'aws-student-cloud-hackathon',
    title: 'AWS Student Cloud Innovation Hackathon',
    organization: 'Amazon Web Services',
    type: 'hackathon',
    url: 'https://aws.amazon.com/events/',
    deadline: null,
    location: 'Global / Virtual',
    remote: true,
    careerSlugs: ['cloud-engineer', 'backend-engineer'],
    skillSlugs: ['cloud-fundamentals', 'aws-services', 'docker-containers'],
    minSkillLevel: 1,
    description: 'Virtual hackathon inviting student teams to build resilient, serverless, and cloud-native architectures solving community challenges.'
  },
  {
    slug: 'palantir-future-scholarship',
    title: 'Palantir Future Scholarship & Mentorship',
    organization: 'Palantir Technologies',
    type: 'scholarship',
    url: 'https://www.palantir.com/careers/students/scholarships/',
    deadline: null,
    location: 'Global',
    remote: true,
    careerSlugs: ['data-engineer', 'cybersecurity-engineer', 'backend-engineer'],
    skillSlugs: ['sql', 'python', 'cybersecurity-fundamentals'],
    minSkillLevel: 2,
    description: 'Grants financial scholarships and executive engineering mentorship to promising undergraduate students pursuing technology careers.'
  },
  {
    slug: 'nsa-codebreaker-challenge',
    title: 'NSA Codebreaker Cybersecurity Challenge',
    organization: 'National Security Agency',
    type: 'competition',
    url: 'https://nsa-codebreaker.org/',
    deadline: null,
    location: 'United States',
    remote: true,
    careerSlugs: ['cybersecurity-engineer'],
    skillSlugs: ['network-security', 'cryptography', 'bash-linux', 'cybersecurity-fundamentals'],
    minSkillLevel: 2,
    description: 'Hands-on technical challenge featuring progressive real-world cybersecurity, reverse engineering, and threat analysis scenarios.'
  }
];
