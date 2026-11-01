import { format, parseISO } from 'date-fns';

export const OUTFITS = [
  {
    id: 'navy',
    name: 'Midnight Navy',
    detail: 'Three-piece · peak lapel',
    image:
      'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/cda7ee329_generated_image.png',
  },
  {
    id: 'charcoal',
    name: 'Charcoal Wool',
    detail: 'Two-piece · notch lapel',
    image:
      'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/df7b13c8f_generated_image.png',
  },
  {
    id: 'ivory',
    name: 'Ivory Dinner Jacket',
    detail: 'Shawl collar · evening',
    image:
      'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/8fe904b70_generated_image.png',
  },
];

export const BACKDROPS = [
  {
    id: 'studio',
    name: 'Studio Grey',
    detail: 'Seamless paper',
    image:
      'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/bfa0f0709_generated_image.png',
  },
  {
    id: 'sand',
    name: 'Warm Sand',
    detail: 'Microcement wall',
    image:
      'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/db4d1c8ef_generated_image.png',
  },
  {
    id: 'emerald',
    name: 'Emerald Drape',
    detail: 'Velvet · low light',
    image:
      'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/f8974f195_generated_image.png',
  },
];

export const SAMPLE_PORTRAIT =
  'https://media.base44.com/images/public/6ae7690b968888ad1ecb8786/015b9393d_generated_image.png';

export const RATIOS = [
  { id: '4:5', label: 'Portrait', hint: 'CV · LinkedIn' },
  { id: '1:1', label: 'Square', hint: 'Feed' },
  { id: '16:9', label: 'Wide', hint: 'Banner' },
];

export const EVENTS = [
  {
    id: 'e1',
    title: 'Series B announcement',
    type: 'Milestone',
    date: '2026-11-04',
    time: '09:00',
    location: 'HQ · All hands',
    relevance: 'High',
    theme: 'the next chapter of the company',
    angle: 'We crossed a line this week that a hundred small decisions made possible.',
  },
  {
    id: 'e2',
    title: 'Keynote — Product Vision 2027',
    type: 'Speaking',
    date: '2026-11-07',
    time: '14:30',
    location: 'Convention Centre, Hall 2',
    relevance: 'High',
    theme: 'building for people who are not in the room',
    angle: 'The best product decisions are the ones your customers never notice you made.',
  },
  {
    id: 'e3',
    title: 'Panel — The Future of Fintech',
    type: 'Panel',
    date: '2026-11-12',
    time: '18:00',
    location: 'The Assembly Rooms',
    relevance: 'Medium',
    theme: 'regulation as a design constraint',
    angle: 'Constraint is where craft shows up. Nobody wins by waiting for the rules to settle.',
  },
  {
    id: 'e4',
    title: 'Podcast recording · The Long Game',
    type: 'Media',
    date: '2026-11-15',
    time: '11:00',
    location: 'Remote',
    relevance: 'Medium',
    theme: 'the unglamorous middle of a project',
    angle: 'Every project has a stretch where nothing is visible. That stretch is the work.',
  },
  {
    id: 'e5',
    title: '1:1 with Priya Raman',
    type: 'Internal',
    date: '2026-11-03',
    time: '10:15',
    location: 'Room 4B',
    relevance: 'Low',
    theme: 'team rhythms',
    angle: 'A good one-to-one is a conversation nobody has to schedule twice.',
  },
];

export const TONES = [
  { id: 'insightful', label: 'Insightful' },
  { id: 'personal', label: 'Personal' },
  { id: 'bold', label: 'Bold' },
];

export const PLATFORMS = ['LinkedIn', 'X'];

export const QUEUED = [
  {
    id: 'q1',
    title: 'Why our roadmap starts with the last mile',
    platform: 'LinkedIn',
    when: 'Thu 5 Nov · 08:30',
    source: 'Keynote — Product Vision 2027',
  },
  {
    id: 'q2',
    title: 'The unglamorous middle',
    platform: 'X',
    when: 'Sat 14 Nov · 17:00',
    source: 'Podcast recording · The Long Game',
  },
];

const HOOKS = {
  insightful: [
    'Most teams treat this as a launch problem. It is a sequencing problem.',
    'The quietest lever here is the one nobody puts on the roadmap.',
  ],
  personal: [
    'I have been carrying one question around all week.',
    'A year ago I would have answered this very differently.',
  ],
  bold: [
    'Hot take: a lot of roadmaps are about to become obsolete.',
    'Everyone is answering the wrong question about this. Here is the version that holds up.',
  ],
};

const BODIES = {
  insightful:
    'Three things I keep coming back to:\n\n1. The people closest to the work usually already know the answer.\n2. Speed is a decision, not a tool.\n3. Clarity beats cleverness, every single time.',
  personal:
    'What I keep learning is that the work that matters rarely looks impressive from the outside.\n\nIt looks like one more conversation, one more revision, one more honest look at the numbers in the evening.',
  bold:
    'If your plan for the next two quarters does not mention this, it is already late.\n\nThe teams that win will be the ones who decide early and say it clearly.',
};

export function formatEventDate(date) {
  return format(parseISO(date), 'EEE d MMM');
}

export function composeDraft(event, tone, variant = 0, platform = 'LinkedIn') {
  const hooks = HOOKS[tone] || HOOKS.insightful;
  const hook = hooks[variant % hooks.length];
  const body = BODIES[tone] || BODIES.insightful;
  const context = `${event.angle} In practice that means ${event.theme} moves from a slide to a decision.`;
  const close = `${event.title} on ${formatEventDate(event.date)} is where I will try to say it out loud. If you will be in the room, come find me.`;
  const tags = platform === 'LinkedIn' ? '\n\n#leadership #product #buildinginpublic' : '';
  return `${hook}\n\n${context}\n\n${body}\n\n${close}${tags}`;
}