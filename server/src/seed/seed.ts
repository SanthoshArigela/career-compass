import { connectDB, disconnectDB } from '../db/connect';
import { env } from '../config/env';
import { Skill, Career, Resource, Project, Opportunity } from '../models';
import { skillsData } from './data/skills';
import { careersData } from './data/careers';
import { resourcesData } from './data/resources';
import { projectsData } from './data/projects';
import { opportunitiesData } from './data/opportunities';
import { verifyDatabaseIntegrity, verifyStaticSeedData } from './verify';
import { Types } from 'mongoose';

/**
 * Idempotently seeds the Career Compass catalog database using stable slug keys.
 * Never performs destructive bulk deletes.
 */
export const runSeed = async (): Promise<{
  skillsCount: number;
  careersCount: number;
  resourcesCount: number;
  projectsCount: number;
  opportunitiesCount: number;
}> => {
  // 1. Static pre-flight integrity check
  const staticIssues = verifyStaticSeedData();
  if (staticIssues.length > 0) {
    throw new Error(
      `Static seed data validation failed before database insertion: ${JSON.stringify(staticIssues)}`
    );
  }

  console.log('[Seed] Connecting to MongoDB...');
  await connectDB(env.MONGODB_URI);

  try {
    // ==========================================
    // 1. SEED SKILLS (Pass 1: Insert/Update Base)
    // ==========================================
    console.log(`[Seed] Upserting ${skillsData.length} skills...`);
    const skillMap = new Map<string, Types.ObjectId>();

    for (const skill of skillsData) {
      const doc = await Skill.findOneAndUpdate(
        { slug: skill.slug },
        {
          $set: {
            name: skill.name,
            category: skill.category,
            description: skill.description,
            hoursPerLevel: skill.hoursPerLevel
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      skillMap.set(skill.slug, doc._id as Types.ObjectId);
    }

    // Pass 2: Resolve and update prerequisites
    for (const skill of skillsData) {
      const prereqIds = skill.prerequisiteSlugs
        .map((slug) => skillMap.get(slug))
        .filter((id): id is Types.ObjectId => Boolean(id));

      await Skill.updateOne(
        { slug: skill.slug },
        { $set: { prerequisites: prereqIds } }
      );
    }

    // ==========================================
    // 2. SEED CAREERS
    // ==========================================
    console.log(`[Seed] Upserting ${careersData.length} careers...`);
    const careerMap = new Map<string, Types.ObjectId>();

    for (const career of careersData) {
      const resolvedSkills = career.requiredSkills.map((req) => {
        const skillId = skillMap.get(req.skillSlug);
        if (!skillId) {
          throw new Error(`Unresolved skill slug "${req.skillSlug}" in career "${career.slug}"`);
        }
        return {
          skillId,
          requiredLevel: req.requiredLevel,
          importance: req.importance
        };
      });

      const doc = await Career.findOneAndUpdate(
        { slug: career.slug },
        {
          $set: {
            title: career.title,
            summary: career.summary,
            dayInLife: career.dayInLife,
            category: career.category,
            interestTags: career.interestTags,
            requiredSkills: resolvedSkills,
            entryRoutes: career.entryRoutes
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      careerMap.set(career.slug, doc._id as Types.ObjectId);
    }

    // ==========================================
    // 3. SEED RESOURCES
    // ==========================================
    console.log(`[Seed] Upserting ${resourcesData.length} resources...`);
    for (const res of resourcesData) {
      const resolvedSkillIds = res.skillSlugs.map((slug) => {
        const id = skillMap.get(slug);
        if (!id) throw new Error(`Unresolved skill slug "${slug}" in resource "${res.slug}"`);
        return id;
      });

      await Resource.findOneAndUpdate(
        { slug: res.slug },
        {
          $set: {
            title: res.title,
            url: res.url,
            provider: res.provider,
            type: res.type,
            skillIds: resolvedSkillIds,
            level: res.level,
            levelGranted: res.levelGranted,
            durationHours: res.durationHours,
            cost: res.cost
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // ==========================================
    // 4. SEED PROJECTS
    // ==========================================
    console.log(`[Seed] Upserting ${projectsData.length} projects...`);
    for (const proj of projectsData) {
      const resolvedSkillIds = proj.skillSlugs.map((slug) => {
        const id = skillMap.get(slug);
        if (!id) throw new Error(`Unresolved skill slug "${slug}" in project "${proj.slug}"`);
        return id;
      });

      const resolvedCareerIds = proj.careerSlugs.map((slug) => {
        const id = careerMap.get(slug);
        if (!id) throw new Error(`Unresolved career slug "${slug}" in project "${proj.slug}"`);
        return id;
      });

      const resolvedGains = proj.skillLevelsGained.map((gain) => {
        const id = skillMap.get(gain.skillSlug);
        if (!id) throw new Error(`Unresolved skill slug "${gain.skillSlug}" in project gains "${proj.slug}"`);
        return {
          skillId: id,
          levelGain: gain.levelGain
        };
      });

      await Project.findOneAndUpdate(
        { slug: proj.slug },
        {
          $set: {
            ownerId: null,
            source: proj.source,
            title: proj.title,
            description: proj.description,
            difficulty: proj.difficulty,
            estimatedHours: proj.estimatedHours,
            skillIds: resolvedSkillIds,
            careerIds: resolvedCareerIds,
            deliverables: proj.deliverables,
            skillLevelsGained: resolvedGains
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // ==========================================
    // 5. SEED OPPORTUNITIES
    // ==========================================
    console.log(`[Seed] Upserting ${opportunitiesData.length} opportunities...`);
    for (const opp of opportunitiesData) {
      const resolvedCareerIds = opp.careerSlugs.map((slug) => {
        const id = careerMap.get(slug);
        if (!id) throw new Error(`Unresolved career slug "${slug}" in opportunity "${opp.slug}"`);
        return id;
      });

      const resolvedSkillIds = opp.skillSlugs.map((slug) => {
        const id = skillMap.get(slug);
        if (!id) throw new Error(`Unresolved skill slug "${slug}" in opportunity "${opp.slug}"`);
        return id;
      });

      await Opportunity.findOneAndUpdate(
        { slug: opp.slug },
        {
          $set: {
            title: opp.title,
            organization: opp.organization,
            type: opp.type,
            url: opp.url,
            deadline: opp.deadline,
            location: opp.location,
            remote: opp.remote,
            careerIds: resolvedCareerIds,
            skillIds: resolvedSkillIds,
            minSkillLevel: opp.minSkillLevel,
            description: opp.description
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // ==========================================
    // 6. POST-SEED INTEGRITY VERIFICATION
    // ==========================================
    console.log('[Seed] Verifying relational integrity across inserted documents...');
    const dbIssues = await verifyDatabaseIntegrity();
    if (dbIssues.length > 0) {
      throw new Error(`Database verification failed after seed: ${JSON.stringify(dbIssues)}`);
    }

    const counts = {
      skillsCount: await Skill.countDocuments(),
      careersCount: await Career.countDocuments(),
      resourcesCount: await Resource.countDocuments(),
      projectsCount: await Project.countDocuments(),
      opportunitiesCount: await Opportunity.countDocuments()
    };

    console.log('[Seed Success] Seeding completed with 0 errors.');
    console.log(` - Skills in DB: ${counts.skillsCount}`);
    console.log(` - Careers in DB: ${counts.careersCount}`);
    console.log(` - Resources in DB: ${counts.resourcesCount}`);
    console.log(` - Projects in DB: ${counts.projectsCount}`);
    console.log(` - Opportunities in DB: ${counts.opportunitiesCount}`);

    return counts;
  } finally {
    await disconnectDB();
  }
};

// Main execution wrapper
const main = async () => {
  if (!env.MONGODB_URI || env.MONGODB_URI.trim().length === 0) {
    console.error(
      '[Seed Error] MONGODB_URI is not set in environment (.env). Please configure MONGODB_URI before running seed.'
    );
    process.exit(1);
  }

  try {
    await runSeed();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to complete database seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
