import { skillsData, SeedSkill } from './data/skills';
import { careersData, SeedCareer } from './data/careers';
import { resourcesData, SeedResource } from './data/resources';
import { projectsData, SeedProject } from './data/projects';
import { opportunitiesData, SeedOpportunity } from './data/opportunities';
import { connectDB, disconnectDB, isDbConnected } from '../db/connect';
import { env } from '../config/env';
import { Skill, Career, Resource, Project, Opportunity } from '../models';

export interface VerificationIssue {
  entity: string;
  slug?: string;
  field: string;
  message: string;
}

/**
 * Validates the in-memory static seed data structures and relational integrity.
 * Returns a list of issues found.
 */
export const verifyStaticSeedData = (
  skills: SeedSkill[] = skillsData,
  careers: SeedCareer[] = careersData,
  resources: SeedResource[] = resourcesData,
  projects: SeedProject[] = projectsData,
  opportunities: SeedOpportunity[] = opportunitiesData
): VerificationIssue[] => {
  const issues: VerificationIssue[] = [];

  const skillSlugSet = new Set<string>();
  const careerSlugSet = new Set<string>();
  const resourceSlugSet = new Set<string>();
  const projectSlugSet = new Set<string>();
  const opportunitySlugSet = new Set<string>();

  // 1. Verify Skills
  for (const s of skills) {
    if (skillSlugSet.has(s.slug)) {
      issues.push({ entity: 'Skill', slug: s.slug, field: 'slug', message: `Duplicate skill slug: "${s.slug}"` });
    }
    skillSlugSet.add(s.slug);

    if (s.hoursPerLevel < 0) {
      issues.push({ entity: 'Skill', slug: s.slug, field: 'hoursPerLevel', message: 'hoursPerLevel cannot be negative' });
    }
  }

  // Verify Skill Prerequisites
  for (const s of skills) {
    for (const prereq of s.prerequisiteSlugs) {
      if (!skillSlugSet.has(prereq)) {
        issues.push({
          entity: 'Skill',
          slug: s.slug,
          field: 'prerequisiteSlugs',
          message: `Referenced prerequisite skill "${prereq}" does not exist`
        });
      }
    }
  }

  // 2. Verify Careers
  for (const c of careers) {
    if (careerSlugSet.has(c.slug)) {
      issues.push({ entity: 'Career', slug: c.slug, field: 'slug', message: `Duplicate career slug: "${c.slug}"` });
    }
    careerSlugSet.add(c.slug);

    for (const req of c.requiredSkills) {
      if (!skillSlugSet.has(req.skillSlug)) {
        issues.push({
          entity: 'Career',
          slug: c.slug,
          field: 'requiredSkills.skillSlug',
          message: `Required skill "${req.skillSlug}" does not exist in skills dataset`
        });
      }

      if (req.requiredLevel < 0 || req.requiredLevel > 5) {
        issues.push({
          entity: 'Career',
          slug: c.slug,
          field: 'requiredSkills.requiredLevel',
          message: `requiredLevel ${req.requiredLevel} is out of bounds (0-5)`
        });
      }

      if (req.importance < 1 || req.importance > 3) {
        issues.push({
          entity: 'Career',
          slug: c.slug,
          field: 'requiredSkills.importance',
          message: `importance ${req.importance} is out of bounds (1-3)`
        });
      }
    }
  }

  // 3. Verify Resources
  for (const r of resources) {
    if (resourceSlugSet.has(r.slug)) {
      issues.push({ entity: 'Resource', slug: r.slug, field: 'slug', message: `Duplicate resource slug: "${r.slug}"` });
    }
    resourceSlugSet.add(r.slug);

    if (!r.url.startsWith('http://') && !r.url.startsWith('https://')) {
      issues.push({ entity: 'Resource', slug: r.slug, field: 'url', message: `URL "${r.url}" is not valid HTTP/HTTPS` });
    }

    if (r.levelGranted < 0 || r.levelGranted > 5) {
      issues.push({ entity: 'Resource', slug: r.slug, field: 'levelGranted', message: `levelGranted ${r.levelGranted} out of bounds (0-5)` });
    }

    for (const skillSlug of r.skillSlugs) {
      if (!skillSlugSet.has(skillSlug)) {
        issues.push({
          entity: 'Resource',
          slug: r.slug,
          field: 'skillSlugs',
          message: `Referenced skill "${skillSlug}" does not exist in skills dataset`
        });
      }
    }
  }

  // 4. Verify Projects
  for (const p of projects) {
    if (projectSlugSet.has(p.slug)) {
      issues.push({ entity: 'Project', slug: p.slug, field: 'slug', message: `Duplicate project slug: "${p.slug}"` });
    }
    projectSlugSet.add(p.slug);

    for (const skillSlug of p.skillSlugs) {
      if (!skillSlugSet.has(skillSlug)) {
        issues.push({
          entity: 'Project',
          slug: p.slug,
          field: 'skillSlugs',
          message: `Referenced skill "${skillSlug}" does not exist in skills dataset`
        });
      }
    }

    for (const careerSlug of p.careerSlugs) {
      if (!careerSlugSet.has(careerSlug)) {
        issues.push({
          entity: 'Project',
          slug: p.slug,
          field: 'careerSlugs',
          message: `Referenced career "${careerSlug}" does not exist in careers dataset`
        });
      }
    }

    for (const gain of p.skillLevelsGained) {
      if (!skillSlugSet.has(gain.skillSlug)) {
        issues.push({
          entity: 'Project',
          slug: p.slug,
          field: 'skillLevelsGained.skillSlug',
          message: `Gained skill "${gain.skillSlug}" does not exist in skills dataset`
        });
      }
      if (gain.levelGain < 0 || gain.levelGain > 5) {
        issues.push({
          entity: 'Project',
          slug: p.slug,
          field: 'skillLevelsGained.levelGain',
          message: `levelGain ${gain.levelGain} out of bounds (0-5)`
        });
      }
    }
  }

  // 5. Verify Opportunities
  for (const o of opportunities) {
    if (opportunitySlugSet.has(o.slug)) {
      issues.push({ entity: 'Opportunity', slug: o.slug, field: 'slug', message: `Duplicate opportunity slug: "${o.slug}"` });
    }
    opportunitySlugSet.add(o.slug);

    if (!o.url.startsWith('http://') && !o.url.startsWith('https://')) {
      issues.push({ entity: 'Opportunity', slug: o.slug, field: 'url', message: `URL "${o.url}" is not valid HTTP/HTTPS` });
    }

    if (o.minSkillLevel < 0 || o.minSkillLevel > 5) {
      issues.push({ entity: 'Opportunity', slug: o.slug, field: 'minSkillLevel', message: `minSkillLevel ${o.minSkillLevel} out of bounds (0-5)` });
    }

    for (const careerSlug of o.careerSlugs) {
      if (!careerSlugSet.has(careerSlug)) {
        issues.push({
          entity: 'Opportunity',
          slug: o.slug,
          field: 'careerSlugs',
          message: `Referenced career "${careerSlug}" does not exist in careers dataset`
        });
      }
    }

    for (const skillSlug of o.skillSlugs) {
      if (!skillSlugSet.has(skillSlug)) {
        issues.push({
          entity: 'Opportunity',
          slug: o.slug,
          field: 'skillSlugs',
          message: `Referenced skill "${skillSlug}" does not exist in skills dataset`
        });
      }
    }
  }

  return issues;
};

/**
 * Validates references inside a live MongoDB database.
 */
export const verifyDatabaseIntegrity = async (): Promise<VerificationIssue[]> => {
  const issues: VerificationIssue[] = [];

  const allSkills = await Skill.find().lean();
  const allCareers = await Career.find().lean();
  const allResources = await Resource.find().lean();
  const allProjects = await Project.find().lean();
  const allOpportunities = await Opportunity.find().lean();

  const skillIdSet = new Set(allSkills.map((s) => s._id.toString()));
  const careerIdSet = new Set(allCareers.map((c) => c._id.toString()));

  // Check Career -> Skill references
  for (const career of allCareers) {
    for (const req of career.requiredSkills) {
      if (!skillIdSet.has(req.skillId.toString())) {
        issues.push({
          entity: 'Career',
          slug: career.slug,
          field: 'requiredSkills',
          message: `Career references missing skill ObjectId: ${req.skillId}`
        });
      }
    }
  }

  // Check Resource -> Skill references
  for (const res of allResources) {
    for (const sId of res.skillIds) {
      if (!skillIdSet.has(sId.toString())) {
        issues.push({
          entity: 'Resource',
          slug: res.slug,
          field: 'skillIds',
          message: `Resource references missing skill ObjectId: ${sId}`
        });
      }
    }
  }

  // Check Project -> Skill & Career references
  for (const proj of allProjects) {
    for (const sId of proj.skillIds) {
      if (!skillIdSet.has(sId.toString())) {
        issues.push({
          entity: 'Project',
          slug: proj.slug,
          field: 'skillIds',
          message: `Project references missing skill ObjectId: ${sId}`
        });
      }
    }
    for (const cId of proj.careerIds) {
      if (!careerIdSet.has(cId.toString())) {
        issues.push({
          entity: 'Project',
          slug: proj.slug,
          field: 'careerIds',
          message: `Project references missing career ObjectId: ${cId}`
        });
      }
    }
    for (const gain of proj.skillLevelsGained) {
      if (!skillIdSet.has(gain.skillId.toString())) {
        issues.push({
          entity: 'Project',
          slug: proj.slug,
          field: 'skillLevelsGained',
          message: `Project skillLevelsGained references missing skill ObjectId: ${gain.skillId}`
        });
      }
    }
  }

  // Check Opportunity -> Skill & Career references
  for (const opp of allOpportunities) {
    for (const sId of opp.skillIds) {
      if (!skillIdSet.has(sId.toString())) {
        issues.push({
          entity: 'Opportunity',
          slug: opp.slug,
          field: 'skillIds',
          message: `Opportunity references missing skill ObjectId: ${sId}`
        });
      }
    }
    for (const cId of opp.careerIds) {
      if (!careerIdSet.has(cId.toString())) {
        issues.push({
          entity: 'Opportunity',
          slug: opp.slug,
          field: 'careerIds',
          message: `Opportunity references missing career ObjectId: ${cId}`
        });
      }
    }
  }

  return issues;
};

/**
 * CLI execution entrypoint for verification script.
 */
const runVerificationCli = async () => {
  console.log('[Verification] Running static seed data validation...');
  const staticIssues = verifyStaticSeedData();

  if (staticIssues.length > 0) {
    console.error(`[Verification Error] Found ${staticIssues.length} issue(s) in static seed data:`);
    for (const issue of staticIssues) {
      console.error(` - [${issue.entity} ${issue.slug ?? ''}]: ${issue.field} -> ${issue.message}`);
    }
    process.exit(1);
  }
  console.log('[Verification] Static seed data is 100% valid with zero broken references.');

  // If MongoDB URI is configured, also verify against database
  if (env.MONGODB_URI && env.MONGODB_URI.trim().length > 0) {
    console.log('[Verification] MONGODB_URI detected. Connecting to verify database integrity...');
    try {
      await connectDB(env.MONGODB_URI);
      const dbIssues = await verifyDatabaseIntegrity();
      await disconnectDB();

      if (dbIssues.length > 0) {
        console.error(`[Verification Error] Found ${dbIssues.length} issue(s) in database records:`);
        for (const issue of dbIssues) {
          console.error(` - [${issue.entity} ${issue.slug ?? ''}]: ${issue.field} -> ${issue.message}`);
        }
        process.exit(1);
      }
      console.log('[Verification] Database integrity verified: All database references resolve successfully.');
    } catch (err) {
      console.warn('[Verification Warning] Could not connect to database to verify live DB records:', err);
    }
  } else {
    console.log('[Verification] MONGODB_URI not configured. Static verification passed successfully.');
  }

  process.exit(0);
};

// If executed directly from command line
if (require.main === module) {
  runVerificationCli();
}
