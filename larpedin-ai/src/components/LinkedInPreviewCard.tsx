import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Edit3,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Globe,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { UserPersona, WritingTone } from '../types';

interface LinkedInPreviewCardProps {
  postContent: string;
  wordCount: number;
  persona: UserPersona;
  isGenerating: boolean;
  isRefining: boolean;
  onUpdateContent: (content: string) => void;
  onRefine: (instruction: string) => void;
  onSaveDraft: () => void;
  isSaved: boolean;
}

export const LinkedInPreviewCard: React.FC<LinkedInPreviewCardProps> = ({
  postContent,
  wordCount,
  persona,
  isGenerating,
  isRefining,
  onUpdateContent,
  onRefine,
  onSaveDraft,
  isSaved,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [customRefineInput, setCustomRefineInput] = useState('');
  const [showRefineBar, setShowRefineBar] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Word count evaluation
  const isOptimalWordCount = wordCount >= 100 && wordCount <= 180;
  const isUnderWordCount = wordCount < 100 && wordCount > 0;
  const isOverWordCount = wordCount > 180;

  // Hashtag count calculation
  const hashtagMatches = postContent.match(/#[\w\d_]+/g) || [];
  const hashtagCount = hashtagMatches.length;
  const hasValidHashtags = hashtagCount >= 2 && hashtagCount <= 3;

  // Reading time estimate (approx 200 wpm)
  const readingSeconds = Math.max(15, Math.round((wordCount / 200) * 60));

  const quickRefinements = [
    { label: 'Tighten Hook', prompt: 'Make the opening hook line more scroll-stopping and punchy while staying within 100-180 words.' },
    { label: 'Make More Punchy', prompt: 'Make sentences shorter and crisper with maximum scannability and high impact.' },
    { label: 'Trim 20 Words', prompt: 'Trim unnecessary filler words to make it tighter while preserving the core lesson and staying within 100-180 words.' },
    { label: 'Add Takeaways', prompt: 'Add 2 clear bullet takeaways for the reader while ensuring the post remains under 180 words total.' },
    { label: 'Humble & Relatable', prompt: 'Tone down any assertive language to sound more humble, curious, and relatable.' },
  ];

  // Helper to render text with styled hashtags
  const renderFormattedContent = (text: string) => {
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((para, pIdx) => {
      const parts = para.split(/(#[\w\d_]+)/g);
      return (
        <p key={pIdx} className="mb-3.5 leading-relaxed text-slate-900 text-[14px]">
          {parts.map((part, idx) => {
            if (part.startsWith('#')) {
              return (
                <span
                  key={idx}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer mr-1"
                >
                  {part}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Inspector / Validation Status Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Word Count Pill/Meter */}
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-500">Word Count:</span>
            <span
              className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded ${
                isOptimalWordCount
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isOverWordCount
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {wordCount} words
            </span>
            <span className="text-[11px] text-slate-400">/ 100–180 target</span>
          </div>

          <span className="text-slate-200" aria-hidden="true">
            |
          </span>

          {/* Hashtag Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Hashtags:</span>
            <span
              className={`font-mono font-bold tabular-nums px-1.5 py-0.5 rounded text-[11px] ${
                hasValidHashtags
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {hashtagCount} {hasValidHashtags ? '✓' : '(aim for 2-3)'}
            </span>
          </div>

          <span className="text-slate-200" aria-hidden="true">
            |
          </span>

          {/* Read Time */}
          <div className="text-slate-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono tabular-nums">~{readingSeconds}s read</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {isOptimalWordCount ? (
            <span className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Optimal LinkedIn Spec</span>
            </span>
          ) : isUnderWordCount ? (
            <span className="text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Under 100 words</span>
            </span>
          ) : (
            <span className="text-rose-700 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Exceeds 180 words</span>
            </span>
          )}
        </div>
      </div>

      {/* Main LinkedIn Feed Card Replica */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        {/* Post Author Header */}
        <div className="p-4 pb-2 flex items-start justify-between gap-3 border-b border-slate-100">
          <div className="flex items-start gap-3 min-w-0">
            <img
              src={persona.avatarUrl}
              alt={persona.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {persona.name}
                </span>
                <span className="text-xs text-slate-400">· 1st</span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">
                {persona.headline}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <span>Just now</span>
                <span aria-hidden="true">·</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isEditing
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Edit directly in place"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEditing ? 'Done Editing' : 'Edit'}</span>
            </button>
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post Body Content Area */}
        <div className="p-4 sm:p-5">
          {isGenerating ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-600">
                Personalizing post for {persona.industry}...
              </p>
              <p className="text-[11px] text-slate-400">
                Applying 100–180 word target & anti-cliché filters
              </p>
            </div>
          ) : isEditing ? (
            <div className="space-y-2">
              <textarea
                rows={10}
                value={postContent}
                onChange={(e) => onUpdateContent(e.target.value)}
                className="w-full text-[14px] leading-relaxed p-3 bg-slate-50 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="Write or edit your post..."
              />
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Edits update live word counters immediately</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                >
                  Save Edits
                </button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap select-text">
              {renderFormattedContent(postContent)}
            </div>
          )}
        </div>

        {/* Engagement Stats Strip */}
        <div className="px-5 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px]">
              👍
            </span>
            <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-[9px] -ml-2">
              💡
            </span>
            <span className="font-mono tabular-nums ml-0.5">
              {liked ? '43 reactions' : '42 reactions'}
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span>8 comments</span>
            <span>3 reposts</span>
          </div>
        </div>

        {/* Authentic Reaction Action Buttons */}
        <div className="px-2 py-1 bg-slate-50/70 border-t border-slate-200/70 grid grid-cols-4 gap-1">
          <button
            onClick={() => setLiked(!liked)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              liked
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-blue-600' : ''}`} />
            <span>Like</span>
          </button>

          <button className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center gap-1.5 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>

          <button className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center gap-1.5 transition-colors">
            <Repeat2 className="w-4 h-4" />
            <span>Repost</span>
          </button>

          <button className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center gap-1.5 transition-colors">
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar & Refinement Suite */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Post Text</span>
                </>
              )}
            </button>

            <button
              onClick={onSaveDraft}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Saved in Drafts</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Save Draft</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRefineBar(!showRefineBar)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                showRefineBar
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Polish Tools</span>
            </button>

            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 transition-colors flex items-center gap-1.5"
              title="Copies text and opens LinkedIn"
            >
              <span>Publish on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Refine Buttons */}
        {showRefineBar && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>1-Click Tone & Length Polish:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickRefinements.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onRefine(item.prompt)}
                    disabled={isRefining || isGenerating}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 transition-colors disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Refinement Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customRefineInput.trim()) {
                  onRefine(customRefineInput.trim());
                  setCustomRefineInput('');
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customRefineInput}
                onChange={(e) => setCustomRefineInput(e.target.value)}
                placeholder="Give specific direction (e.g. 'Add a question at the end for readers' or 'Make it punchier')..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isRefining || isGenerating || !customRefineInput.trim()}
                className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors shrink-0"
              >
                {isRefining ? 'Polishing...' : 'Refine'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
