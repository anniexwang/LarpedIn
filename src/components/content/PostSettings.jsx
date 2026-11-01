import { useState } from 'react';
import { Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const INDUSTRIES = [
  'Software / Tech',
  'Data & AI',
  'Finance',
  'Consulting',
  'Marketing',
  'Healthcare',
  'Education',
  'Design',
  'Engineering',
  'Law',
  'Student',
];

const EVENT_TYPES = [
  'Career fair',
  'Networking',
  'Hackathon',
  'Conference',
  'Workshop',
  'Interview',
  'New job / internship',
  'Project launch',
  'Other',
];

const today = () => new Date().toISOString().slice(0, 10);

const inputClass =
  'w-full rounded-[0.8rem] border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent/60';

export default function PostSettings({
  industry,
  setIndustry,
  customTone,
  setCustomTone,
  onAddEvent,
  onGenerate,
  generating,
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: EVENT_TYPES[0], date: today(), notes: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAddEvent({ ...form, title: form.title.trim(), notes: form.notes.trim() });
    setForm({ title: '', type: EVENT_TYPES[0], date: today(), notes: '' });
    setShowForm(false);
  };

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[10.5px] font-medium text-muted-foreground">Your industry</span>
          <input
            list="larpedin-industries"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Software / Tech"
            className={inputClass}
          />
          <datalist id="larpedin-industries">
            {INDUSTRIES.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10.5px] font-medium text-muted-foreground">
            Custom tone (optional, overrides the buttons below)
          </span>
          <input
            value={customTone}
            onChange={(e) => setCustomTone(e.target.value)}
            placeholder="e.g. funny but professional"
            className={inputClass}
          />
        </label>
      </div>

      {showForm ? (
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-[1.1rem] border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold">Add your own event</p>
            <button type="button" aria-label="Close" onClick={() => setShowForm(false)}>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <input
            value={form.title}
            onChange={update('title')}
            placeholder="Event name, e.g. TMU Fall Career Fair"
            className={inputClass}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={form.type} onChange={update('type')} className={inputClass}>
              {EVENT_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input type="date" value={form.date} onChange={update('date')} className={inputClass} />
          </div>
          <textarea
            value={form.notes}
            onChange={update('notes')}
            rows={3}
            placeholder="What happened? Who did you meet? What did you learn? (the AI only uses what you write here)"
            className={`${inputClass} resize-none`}
          />
          <Button type="submit" size="sm" className="rounded-full px-4">
            Add event
          </Button>
        </form>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!showForm && (
          <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setShowForm(true)}>
            <Plus className="mr-1.5 h-3 w-3" /> Add your own event
          </Button>
        )}
        <Button type="button" size="sm" className="rounded-full px-4" onClick={onGenerate} disabled={generating}>
          {generating ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-3 w-3" />
          )}
          {generating ? 'Writing your post...' : 'Write my post with AI'}
        </Button>
      </div>
    </section>
  );
}
