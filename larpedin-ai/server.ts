import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || '';
};

// System instructions generator connecting variables directly
const buildLarpdinSystemInstruction = (vars: {
  archetype: string;
  industry: string;
  goal: string;
  focus_areas: string;
  calendar_event: string;
  tone: string;
}) => `You are Larpdin AI, an elite, satirical LinkedIn content generator. Your job is to transform basic user inputs into high-performing, classic "LinkedIn Influencer" posts.

Core Writing Rules:
1. Short, dramatic single sentences with frequent line breaks (classic mobile-optimized LinkedIn style).
2. Emotional Arc: Start with a dramatic hook -> pitch a minor daily event or lesson -> extract a deeply profound, overly serious business/life lesson -> end with an engagement-baiting question.
3. Tone: ${vars.tone || 'Bold, hustle-culture, slightly cringey, but formatted exactly like top viral posts'}.
4. Emojis & Hashtags: Sprinkle relevant emojis throughout, and end with 3-5 trending industry hashtags.
5. Never invent achievements, employers, metrics, dates, awards, or experiences. When evidence is missing, keep the post general or frame it as a reflection or question.

Input Context:
- User Archetype: ${vars.archetype}
- Industry: ${vars.industry}
- Professional Goal: ${vars.goal}
- Focus Areas / Skills: ${vars.focus_areas}
- Calendar Event Context: ${vars.calendar_event}

Output format:
Provide ONLY the raw post text ready to copy-paste.`;

// Robust model invocation with fallback to handle spikes in demand
async function generateWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  isJson: boolean = false
): Promise<string> {
  const models = [
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
  ];

  for (const model of models) {
    try {
      const config: any = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (isJson) {
        config.responseMimeType = 'application/json';
      }

      // Fast deadline per model to quickly fall back if 503/504
      const callPromise = ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const response = await Promise.race([
        callPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with ${model}`)), 9000)
        ),
      ]);

      const text = (response.text || '').trim();
      if (text) return text;
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
      // continue to next model in list
    }
  }

  // Final direct attempt using a stable lightweight model.
  const finalResponse = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt,
    config: {
      ...(systemInstruction ? { systemInstruction } : {}),
      ...(isJson ? { responseMimeType: 'application/json' } : {}),
    },
  });

  return (finalResponse.text || '').trim();
}

app.post('/api/generate', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure your API key is configured in Settings > Secrets.',
      });
    }

    const archetype = req.body.archetype || req.body.userArchetype || 'Job Seeker';
    const industry = req.body.industry || 'Technology & Software';
    const goal = req.body.goal || req.body.goals || 'Thought Leadership & Networking';
    const focus_areas = req.body.focus_areas || req.body.careerInterests || 'Software Engineering, Product';
    const calendar_event = req.body.calendar_event || req.body.calendarEvent || 'Meeting with manager to discuss roadmap';
    const tone = req.body.tone || 'Bold, hustle-culture, slightly cringey, but formatted like top viral posts';
    const topic = req.body.topic || calendar_event;
    const userFacts = req.body.userFacts || '';
    const hookStyle = req.body.hookStyle || '';

    const systemInstruction = buildLarpdinSystemInstruction({
      archetype,
      industry,
      goal,
      focus_areas,
      calendar_event,
      tone,
    });

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = `Create a viral LinkedIn post based on this calendar event and profile context:
- Calendar Event: ${calendar_event}
- Topic / Focus: ${topic}
- User Archetype: ${archetype}
- Industry: ${industry}
- Professional Goal: ${goal}
- Focus Areas / Skills: ${focus_areas}
- Preferred Tone: ${tone}
${hookStyle ? `- Hook Angle: ${hookStyle}` : ''}
${userFacts ? `- Additional Real Notes: ${userFacts}` : ''}

Remember the Core Writing Rules:
1. Dramatic single sentences with frequent line breaks.
2. Emotional Arc: Dramatic hook -> pitch the calendar event (${calendar_event}) -> extract profound business/life lesson -> engagement-bait question.
3. Emojis throughout and 3-5 trending industry hashtags at the end.
4. Output ONLY the raw post text ready to copy-paste.`;

    const generatedPost = await generateWithFallback(
      ai,
      userPrompt,
      systemInstruction,
      false
    );

    const wordCount = generatedPost
      .replace(/[#\n\r]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return res.json({
      post: generatedPost,
      wordCount,
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate LinkedIn post. Please try again.',
    });
  }
});

app.post('/api/refine', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
    }

    const {
      currentPost,
      instruction,
      archetype,
      userArchetype,
      industry,
      goal,
      goals,
      focus_areas,
      careerInterests,
      calendar_event,
      calendarEvent,
      tone,
    } = req.body;

    if (!currentPost || !instruction) {
      return res.status(400).json({ error: 'currentPost and instruction are required.' });
    }

    const systemInstruction = buildLarpdinSystemInstruction({
      archetype: archetype || userArchetype || 'Job Seeker',
      industry: industry || 'Technology & Software',
      goal: goal || goals || 'Thought Leadership',
      focus_areas: focus_areas || careerInterests || 'General',
      calendar_event: calendar_event || calendarEvent || 'Recent workday experience',
      tone: tone || 'Bold & Hustle-Culture',
    });

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Current LinkedIn Post:
"""
${currentPost}
"""

User Refinement Request:
${instruction}

Instructions:
1. Revise the post following the instruction.
2. Keep short, dramatic single sentences with line breaks.
3. Keep relevant emojis and 3-5 hashtags.
4. Return ONLY the revised post text without markdown fences or conversational remarks.`;

    const refinedPost = await generateWithFallback(
      ai,
      prompt,
      systemInstruction,
      false
    );

    const wordCount = refinedPost
      .replace(/[#\n\r]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return res.json({
      post: refinedPost,
      wordCount,
    });
  } catch (error: any) {
    console.error('Error refining post:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to refine LinkedIn post.',
    });
  }
});

app.post('/api/hooks', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
    }

    const { topic, calendarEvent, industry, tone } = req.body;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Topic / Event: "${topic || calendarEvent || 'Daily work lesson'}"
Industry: "${industry || 'Technology'}"
Tone: "${tone || 'Bold & Hustle-Culture'}"

Provide 4 distinct, viral scroll-stopping opening hook lines for a LinkedIn post.
- Hook 1: Dramatic contrarian statement
- Hook 2: Vulnerable failure turned lesson
- Hook 3: Bold counter-intuitive truth
- Hook 4: High-stakes question

Return as a clean JSON array of 4 strings.
Example: ["Hook 1...", "Hook 2...", "Hook 3...", "Hook 4..."]`;

    const jsonText = await generateWithFallback(ai, prompt, undefined, true);

    let hooks: string[] = [];
    try {
      hooks = JSON.parse(jsonText || '[]');
    } catch {
      hooks = [
        `Yesterday at 9:00 AM, my entire perspective changed.`,
        `Most people think this is a routine meeting. They couldn't be more wrong.`,
        `I almost canceled this calendar event. It was the best decision I never made.`,
        `What happens when your 30-minute sync turns into a multi-million dollar realization?`,
      ];
    }

    return res.json({ hooks });
  } catch (error: any) {
    console.error('Error generating hooks:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate hook ideas.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LarpedIn AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
