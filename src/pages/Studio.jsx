import { useEffect, useState } from 'react';
import { Download, Sparkles, Scissors, X } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StudioStage from '@/components/studio/StudioStage';
import OptionGrid from '@/components/studio/OptionGrid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { OUTFITS_BY_STYLE, BACKDROPS } from '@/lib/mockData';
import { fileToDataUrl } from '@/lib/imageData';
import { generateHeadshots } from '@/lib/headshotApi';
import { compositeHeadshot, preloadFaceTools } from '@/lib/faceComposite';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'outfits', label: 'Outfits' },
  { id: 'backdrops', label: 'Backdrops' },
];

export default function Studio() {
  const [photo, setPhoto] = useState(null);
  const [hairPhoto, setHairPhoto] = useState(null);
  const [outfit, setOutfit] = useState(OUTFITS_BY_STYLE.male[1]);
  const [clothingStyle, setClothingStyle] = useState('male');
  const [backdrop, setBackdrop] = useState(BACKDROPS[0]);
  const [ratio, setRatio] = useState('4:5');
  const [tab, setTab] = useState('outfits');
  const [myOutfits, setMyOutfits] = useState([]);
  const [myBackdrops, setMyBackdrops] = useState([]);
  const [results, setResults] = useState([]);
  const [picked, setPicked] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const result = results[picked];

  // Download the face tools in the background so Generate is quicker.
  useEffect(() => {
    preloadFaceTools();
  }, []);

  // Any change to the inputs clears the old result so the preview is live again.
  const changeInput = (setter) => (value) => {
    setter(value);
    setResults([]);
  };

  const changeClothingStyle = (style) => {
    setClothingStyle(style);
    setOutfit(OUTFITS_BY_STYLE[style][0]);
    setResults([]);
  };

  const addUpload = async (file, setList, select) => {
    if (!file) return;
    const item = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^.]+$/, '').slice(0, 26) || 'Your own image',
      detail: 'Uploaded by you',
      image: await fileToDataUrl(file),
    };
    setList((list) => [...list, item]);
    select(item);
    toast({ title: 'Added to your library', description: item.name });
  };

  const pickHair = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setHairPhoto(await fileToDataUrl(file));
    setResults([]);
  };

  const generate = async () => {
    if (!photo) {
      toast({ title: 'Add a photo first', description: 'Take a selfie or upload one.' });
      return;
    }
    setLoading(true);
    try {
      // 1. AI puts you in the outfit (on Render).
      const aiImages = await generateHeadshots({
        selfie: photo,
        outfitImage: outfit.image,
        clothingStyle,
        hairPhoto,
        numImages: 1,
      });
      // 2. On the phone: paste your real face back on and add the backdrop.
      const finals = await Promise.all(
        aiImages.map((generated) =>
          compositeHeadshot({
            selfie: photo,
            generated,
            backdrop: backdrop.image,
            ratio,
            keepOriginalHair: !hairPhoto,
          }).catch((err) => {
            console.warn('Face paste-back failed, showing the AI image instead', err);
            return generated;
          })
        )
      );
      setResults(finals);
      setPicked(0);
    } catch (err) {
      toast({
        title: 'Could not generate your headshot',
        description: err.message || 'Try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    const blob = await (await fetch(result)).blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'larpedin-headshot.jpg';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <PageHeader
        eyebrow="The studio"
        title="Compose a portrait."
        description="Choose a suit, pick a backdrop, or bring your own. Your face stays exactly as it is, we only change what you're wearing and what's behind you."
      />

      <div className="grid gap-5 pt-6 lg:grid-cols-[minmax(0,1fr)_344px]">
        <div className="space-y-3.5">
          <StudioStage
            photo={photo}
            onPhoto={changeInput(setPhoto)}
            outfit={outfit}
            backdrop={backdrop}
            ratio={ratio}
            setRatio={changeInput(setRatio)}
            result={result}
            loading={loading}
          />

          {results.length > 1 && (
            <div className="flex gap-2">
              {results.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setPicked(i)}
                  className={cn(
                    'h-16 w-16 overflow-hidden rounded-lg border-2',
                    i === picked ? 'border-accent' : 'border-transparent'
                  )}
                >
                  <img src={url} alt={`Option ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {hairPhoto ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border py-1 pl-1 pr-2 text-[11px]">
                  <img src={hairPhoto} alt="Hair reference" className="h-6 w-6 rounded-full object-cover" />
                  Hair photo added
                  <button type="button" aria-label="Remove hair photo" onClick={() => { setHairPhoto(null); setResults([]); }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : (
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Scissors className="h-3 w-3" strokeWidth={2} /> Add hair photo (optional)
                  <input type="file" accept="image/*" className="hidden" onChange={pickHair} />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              {result && (
                <Button onClick={download} size="sm" variant="outline" className="rounded-full px-4">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                </Button>
              )}
              <Button onClick={generate} size="sm" className="rounded-full px-4" disabled={loading}>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> {result ? 'Regenerate' : 'Generate headshot'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 lg:sticky lg:top-[72px] lg:self-start">
          <div className="flex rounded-full border border-border bg-card p-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex-1 rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors',
                  tab === item.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'outfits' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11.5px] font-medium text-foreground">Clothing style</span>
                <div className="flex rounded-full border border-border bg-card p-1" role="group" aria-label="Clothing style">
                  {[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => changeClothingStyle(option.id)}
                      className={cn(
                        'rounded-full px-3 py-1 text-[11px] font-medium transition-colors',
                        clothingStyle === option.id
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      aria-pressed={clothingStyle === option.id}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <OptionGrid
                options={[...OUTFITS_BY_STYLE[clothingStyle], ...myOutfits]}
                selectedId={outfit.id}
                onSelect={changeInput(setOutfit)}
                onUpload={(file) => addUpload(file, setMyOutfits, changeInput(setOutfit))}
                uploadLabel="Upload your own outfit"
              />
            </div>
          ) : (
            <OptionGrid
              options={[...BACKDROPS, ...myBackdrops]}
              selectedId={backdrop.id}
              onSelect={changeInput(setBackdrop)}
              onUpload={(file) => addUpload(file, setMyBackdrops, changeInput(setBackdrop))}
              uploadLabel="Upload your own backdrop"
            />
          )}
        </div>
      </div>
    </div>
  );
}
