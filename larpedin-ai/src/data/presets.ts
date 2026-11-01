import { UserPersona, WritingTone } from '../types';

export const ARCHETYPE_PRESETS: Record<string, UserPersona> = {
  student: {
    archetype: 'student',
    name: 'Maya Lin',
    headline: 'Computer Science Senior @ Tech University · Aspiring Full-Stack & ML Engineer',
    avatarUrl: '/src/assets/images/avatar_student_jobseeker_1793553485248.jpg',
    careerInterests: ['Machine Learning', 'Frontend Systems', 'Open Source', 'Distributed Systems'],
    industry: 'Technology & Software',
    goals: 'Land first junior role, share project learnings, and connect with technical mentors',
    tone: 'Humble & Growth-Oriented',
  },
  job_seeker: {
    archetype: 'job_seeker',
    name: 'Jordan Reynolds',
    headline: 'Product Manager & UX Strategist · Ex-Fintech Lead · Open to New Opportunities',
    avatarUrl: '/src/assets/images/avatar_tech_professional_1793553485707.jpg',
    careerInterests: ['Product Strategy', 'B2B SaaS Growth', 'User Research', 'Design Systems'],
    industry: 'SaaS & Enterprise Tech',
    goals: 'Demonstrate strategic problem-solving, build peer visibility, and secure a Lead PM position',
    tone: 'Insightful & Pragmatic' as WritingTone,
  },
  professional: {
    archetype: 'professional',
    name: 'Dr. Elena Vance',
    headline: 'VP of Engineering · Scaling Distributed Systems & Mentoring Leaders',
    avatarUrl: '/src/assets/images/avatar_career_consultant_1793553485968.jpg',
    careerInterests: ['Engineering Leadership', 'Systems Architecture', 'High-Trust Culture', 'AI Infrastructure'],
    industry: 'Cloud Infrastructure & AI',
    goals: 'Thought leadership, sharing organizational playbooks, and attracting top talent',
    tone: 'Authoritative & Empathetic' as WritingTone,
  },
  custom: {
    archetype: 'custom',
    name: 'Alex Morgan',
    headline: 'Growth Strategist & Operator · Building in Public',
    avatarUrl: '/src/assets/images/avatar_tech_professional_1793553485707.jpg',
    careerInterests: ['Tech Strategy', 'Operations', 'Continuous Learning'],
    industry: 'Technology & Startups',
    goals: 'Share authentic learnings and expand professional network',
    tone: 'Authentic & Reflective',
  },
};

export const INDUSTRY_OPTIONS = [
  'Technology & Software',
  'AI & Machine Learning',
  'Product Management & UX',
  'Finance & Fintech',
  'Healthcare & Biotechnology',
  'Data Science & Analytics',
  'Marketing, Brand & Growth',
  'Sustainability & CleanTech',
  'Consulting & Operations',
  'Education & EdTech',
];

export const TONE_OPTIONS: { id: WritingTone; label: string; desc: string }[] = [
  {
    id: 'Authentic & Reflective',
    label: 'Authentic & Reflective',
    desc: 'Honest, grounded, self-aware lessons without buzzwords or pretension.',
  },
  {
    id: 'Crisp & Punchy',
    label: 'Crisp & Punchy',
    desc: 'Short, sharp sentences designed for fast mobile reading with zero fluff.',
  },
  {
    id: 'Thought Leader & Analytical',
    label: 'Thought Leader & Analytical',
    desc: 'Structured reasoning, frameworks, and sharp industry pattern recognition.',
  },
  {
    id: 'Humble & Growth-Oriented',
    label: 'Humble & Growth-Oriented',
    desc: 'Curious, eager to learn, highlighting mistakes turned into genuine growth.',
  },
  {
    id: 'Inspirational & Actionable',
    label: 'Inspirational & Actionable',
    desc: 'Empowering takeaways that readers can implement in their workday today.',
  },
  {
    id: 'Story-Driven & Personal',
    label: 'Story-Driven & Personal',
    desc: 'Narrative-first journey with relatable conflict, pivot, and realization.',
  },
  {
    id: 'Bold & Hustle-Culture',
    label: 'Bold & Hustle-Culture',
    desc: 'Dramatic hooks, high-stakes lessons, viral influencer cadence, and bold takeaways.',
  },
];

export const CALENDAR_EVENT_PRESETS = [
  'Weekly 1-on-1 with engineering manager',
  'Post-incident postmortem call after production outage',
  'Sprint retrospective with cross-functional team',
  '30-minute coffee catchup with a startup founder',
  'Quarterly product roadmap alignment sync',
  'Final round behavioral interview presentation',
  'Lunch with a senior mentor discussing career growth',
];

export const GOAL_OPTIONS = [
  'Land a new role / Job search visibility',
  'Share technical project build learnings',
  'Industry commentary & pattern breakdown',
  'Expand network & invite meaningful discussion',
  'Career milestone or reflection',
  'Seek mentorship, peer advice, or feedback',
];

export const TOPIC_INSPIRATIONS = [
  {
    audience: 'Students & Grads',
    items: [
      {
        title: 'Building my first real full-stack project',
        topic: 'What building my first real-world project taught me about edge cases and error handling that coursework never mentioned.',
        industry: 'Technology & Software',
        tone: 'Humble & Growth-Oriented' as WritingTone,
      },
      {
        title: 'How to ask for engineering help',
        topic: 'The 15-minute rule: How I ask senior teammates for help without wasting their time or feeling impostor syndrome.',
        industry: 'Technology & Software',
        tone: 'Crisp & Punchy' as WritingTone,
      },
      {
        title: 'Navigating entry-level tech job search',
        topic: 'Reflections on cold outreach that actually led to conversations versus sending 100 generic easy-applies.',
        industry: 'Technology & Software',
        tone: 'Authentic & Reflective' as WritingTone,
      },
    ],
  },
  {
    audience: 'Job Seekers & Switchers',
    items: [
      {
        title: 'Product lessons from 50 customer interviews',
        topic: 'Why users say they want one feature, but their workflow behavior reveals an entirely different problem.',
        industry: 'Product Management & UX',
        tone: 'Thought Leader & Analytical' as WritingTone,
      },
      {
        title: 'Mid-career pivot into Tech',
        topic: 'Transferable skills: How managing high-stakes client crises prepared me for fast-paced agile product delivery.',
        industry: 'SaaS & Enterprise Tech',
        tone: 'Story-Driven & Personal' as WritingTone,
      },
      {
        title: 'Why I turned down an offer that looked good on paper',
        topic: 'Grounded reflections on evaluating team culture, leadership trust, and burnout signals during the interview process.',
        industry: 'Technology & Software',
        tone: 'Authentic & Reflective' as WritingTone,
      },
    ],
  },
  {
    audience: 'Professionals & Leaders',
    items: [
      {
        title: 'The real purpose of 1-on-1 meetings',
        topic: 'Why 1-on-1s should never be status updates, and how to use them to uncover blockers and career trajectories.',
        industry: 'Technology & Software',
        tone: 'Thought Leader & Analytical' as WritingTone,
      },
      {
        title: 'Reframing Technical Debt',
        topic: 'Tech debt isn’t always sloppy code. Most of the time, it’s just the natural result of yesterday’s assumptions meeting today’s scale.',
        industry: 'Cloud Infrastructure & AI',
        tone: 'Crisp & Punchy' as WritingTone,
      },
      {
        title: 'Delegation vs. Abdication',
        topic: 'The fine line between giving engineers autonomy and leaving them unsupported with ambiguous goals.',
        industry: 'Technology & Software',
        tone: 'Inspirational & Actionable' as WritingTone,
      },
    ],
  },
];

export const INITIAL_SAMPLE_POST = `Most junior engineers think great code is about clever abstractions.

It took me three months on a live production codebase to realize the opposite: the best code is boring, readable, and predictable.

When I started, I tried using fancy design patterns for simple logic. A senior engineer pulled me aside during a PR review and said:

"Write code for the person on-call at 2 AM on a Sunday."

That single sentence completely rewired how I approach problem solving.

Now, before I merge anything, I ask three simple questions:
1. Can an engineer unfamiliar with this context debug it in 5 minutes?
2. Are the error logs clear and actionable?
3. Did I simplify, or did I just show off?

Clarity will always beat cleverness.

What’s one piece of code review feedback that permanently changed your workflow?

#SoftwareEngineering #WebDevelopment #CareerAdvice`;
