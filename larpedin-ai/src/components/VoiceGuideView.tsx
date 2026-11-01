import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';

interface VoiceGuideViewProps {
  onBackToStudio: () => void;
}

export const VoiceGuideView: React.FC<VoiceGuideViewProps> = ({ onBackToStudio }) => {
  const guidelines = [
    {
      num: 1,
      title: 'Natural, Professional Tone',
      desc: 'Sound like a colleague sharing a coffee, not a press release or an executive memo.',
      good: '"I spent two hours yesterday debugging what turned out to be a missing semicolon."',
      bad: '"In my continuous pursuit of engineering excellence, I surmounted syntax obstacles."',
    },
    {
      num: 2,
      title: 'Avoid Robotic AI Clichés',
      desc: 'Strictly bans repetitive generative phrases like "delve", "testament to", "game-changer", and "in today\'s fast-paced world".',
      good: '"Most teams wait too long to ship their first version."',
      bad: '"In today\'s fast-paced digital ecosystem, agile velocity is a testament to innovation."',
    },
    {
      num: 3,
      title: 'Strict Length: 100 to 180 Words',
      desc: 'Long enough to convey a real insight; short enough to be read in under 45 seconds on a mobile feed before attention fades.',
      good: '120–150 words with 3–4 punchy paragraphs.',
      bad: 'A 500-word mini-essay or a 20-word hollow quote.',
    },
    {
      num: 4,
      title: 'Engaging Opening Hook',
      desc: 'The first line determines whether readers tap "...see more" or keep scrolling. Make it surprising, counter-intuitive, or direct.',
      good: '"Most career advice fails because it assumes you already have leverage."',
      bad: '"Hello connections, today I wanted to share some thoughts on career strategy."',
    },
    {
      num: 5,
      title: 'Short, Readable Paragraphs',
      desc: '1 to 2 sentences per paragraph with generous blank space so it renders clearly on smartphones.',
      good: 'Bite-sized visual blocks that ease reader fatigue.',
      bad: 'A dense 10-line monolithic wall of text without breaks.',
    },
    {
      num: 6,
      title: 'Exactly 2–3 Relevant Hashtags',
      desc: 'Helps LinkedIn index your post into topic feeds without spamming the bottom with 15 random tags.',
      good: '#SoftwareEngineering #CareerGrowth #WebDevelopment',
      bad: '#tech #career #growth #jobs #hiring #goals #success #love #life #blessed #coding',
    },
    {
      num: 7,
      title: 'Do Not Invent Achievements',
      desc: 'CRITICAL: Never hallucinate awards, revenue figures, job titles, or metrics that the user did not provide.',
      good: 'Focusing on mindset, curiosity, real takeaways, and community questions.',
      bad: 'Making up "Increased company revenue by $4.2M and managed 50 engineers" out of thin air.',
    },
    {
      num: 8,
      title: 'Return Only the Post',
      desc: 'Clean copy-paste readiness with no conversational clutter like "Here is your post below:".',
      good: 'Direct post content ready for LinkedIn.',
      bad: '"Sure! Here is a post for your consideration: ... Let me know if you want revisions!"',
    },
    {
      num: 9,
      title: 'Consistent Brand Voice',
      desc: 'Balances credibility, humility, and actionable insight across all personas from student to VP.',
      good: 'Reliable, thoughtful, articulate, and human.',
      bad: 'Erratic tone swings between corporate buzzwords and slang.',
    },
  ];

  const bannedPhrases = [
    'In today\'s fast-paced world...',
    'I am thrilled / delighted to announce...',
    'A testament to...',
    'Game changer / Paradigm shift',
    'Humbled and honored...',
    'Let that sink in.',
    'Delve deep into...',
    'Super excited to share...',
    'Unpopular opinion: (used trivially)',
    'Without further ado...',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToStudio}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>LarpedIn AI Voice & Authenticity Rules</span>
          </h2>
          <p className="text-xs text-slate-500">
            The 9 foundational guidelines ensuring every post is natural, credible, and scroll-stopping
          </p>
        </div>
      </div>

      {/* Banned AI Clichés Strip */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>The Banned Cliché Lexicon (Filtered Automatically)</span>
        </div>
        <p className="text-xs text-rose-700">
          LarpedIn AI actively flags and excludes generic tropes that scream "AI generated":
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {bannedPhrases.map((phrase, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono text-rose-800 bg-white border border-rose-200 px-2 py-0.5 rounded line-through decoration-rose-500"
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* The 9 Guidelines Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>The 9 Core Guidelines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guidelines.map((g) => (
            <div
              key={g.num}
              className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center">
                  {g.num}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{g.title}</h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-start gap-1.5 text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong>Natural:</strong> {g.good}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-rose-800 bg-rose-50/80 p-2 rounded border border-rose-100">
                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong>Avoid:</strong> {g.bad}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
