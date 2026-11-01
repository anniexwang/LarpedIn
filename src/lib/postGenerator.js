import { base44 } from '@/api/base44Client';
import { formatEventDate } from '@/lib/mockData';

// Writes a LinkedIn (or X) post with Base44's built-in AI writer.
// Works on the free Base44 plan; uses the app's AI credits.
export async function generatePost({ event, tone, industry, platform = 'LinkedIn' }) {
  const isX = platform === 'X';

  const details = [
    `Event: ${event.title}`,
    event.type && `Type of event: ${event.type}`,
    event.date && `Date: ${formatEventDate(event.date)}`,
    event.location && `Where: ${event.location}`,
    event.notes && `What happened / what I want to say (in my words): ${event.notes}`,
    !event.notes && event.description && `Description: ${event.description}`,
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `You write ${isX ? 'X (Twitter)' : 'LinkedIn'} posts for professionals and students.

Write ONE post in the first person about the event below.

Tone: ${tone || 'insightful'}
My industry / field: ${industry || 'not specified'}

${details}

Rules:
- Match the tone exactly.
- Make it relevant to someone in my industry.
- Start with a strong first line (a hook).
${
  isX
    ? '- Keep it under 280 characters. At most 2 hashtags.'
    : '- 120 to 200 words. Short paragraphs with line breaks. End with a question to invite comments, then 3 to 5 relevant hashtags.'
}
- Only use facts given above. Do not invent names, numbers, job titles, awards or achievements.
- Output ONLY the post text. No title, no quotation marks, no explanations.`;

  const result = await base44.integrations.Core.InvokeLLM({ prompt });
  const text = typeof result === 'string' ? result : result?.text || result?.output || JSON.stringify(result);
  return text.trim().replace(/^["']|["']$/g, '');
}
