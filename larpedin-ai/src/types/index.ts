export type UserArchetype = 'student' | 'job_seeker' | 'professional' | 'custom';

export type WritingTone =
  | 'Authentic & Reflective'
  | 'Crisp & Punchy'
  | 'Thought Leader & Analytical'
  | 'Humble & Growth-Oriented'
  | 'Inspirational & Actionable'
  | 'Story-Driven & Personal'
  | 'Bold & Hustle-Culture';

export type HookStyle =
  | 'Contrarian / Surprising'
  | 'Story / Lesson Learned'
  | 'Direct Insight'
  | 'Curious Question';

export interface UserPersona {
  archetype: UserArchetype;
  name: string;
  headline: string;
  avatarUrl: string;
  careerInterests: string[];
  industry: string;
  goals: string;
  tone: WritingTone;
}

export interface PostRequest {
  archetype?: string;
  userArchetype?: string;
  industry: string;
  goal?: string;
  goals?: string;
  focus_areas?: string;
  careerInterests?: string;
  calendar_event?: string;
  calendarEvent?: string;
  topic?: string;
  tone: WritingTone;
  userFacts?: string;
  hookStyle?: HookStyle;
}

export interface GeneratedPost {
  id: string;
  content: string;
  wordCount: number;
  characterCount: number;
  topic: string;
  tone: WritingTone;
  createdAt: string;
  personaName: string;
  personaHeadline: string;
  calendarEvent?: string;
  isSaved?: boolean;
}
