import { useState } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StudioStage from '@/components/studio/StudioStage';
import OptionGrid from '@/components/studio/OptionGrid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { OUTFITS, BACKDROPS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'outfits', label: 'Outfits' },
  { id: 'backdrops', label: 'Backdrops' },
];

export default function Studio() {
  const [photo, setPhoto] = useState(null);
  const [outfit, setOutfit] = useState(OUTFITS[1]);
  const [backdrop, setBackdrop] = useState(BACKDROPS[0]);
  const [ratio, setRatio] = useState('4:5');
  const [tab, setTab] = useState('outfits');
  const [myOutfits, setMyOutfits] = useState([]);
  const [myBackdrops, setMyBackdrops] = useState([]);
  const { toast } = useToast();

  const addUpload = (file, setList, select) => {
    if (!file) return;
    const item = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^.]+$/, '').slice(0, 26) || 'Your own image',
      detail: 'Uploaded by you',
      image: URL.createObjectURL(file),
    };
    setList((list) => [...list, item]);
    select(item);
    toast({ title: 'Added to your library', description: item.name });
  };

  const exportPreview = () => {
    toast({
      title: 'Preview exported',
      description: `${outfit.name} · ${backdrop.name} · ${ratio} — ready for your profile.`,
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="The studio"
        title="Compose a portrait."
        description="Choose a suit, pick a backdrop, or bring your own. Every combination previews live — nothing is final until you export."
      />

      <div className="grid gap-5 pt-6 lg:grid-cols-[minmax(0,1fr)_344px]">
        <div className="space-y-3.5">
          <StudioStage
            photo={photo}
            onPhoto={setPhoto}
            outfit={outfit}
            backdrop={backdrop}
            ratio={ratio}
            setRatio={setRatio}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {photo
                ? 'Photo loaded — swap the look any time.'
                : 'Your photo never leaves this preview.'}
            </p>
            <Button onClick={exportPreview} size="sm" className="rounded-full px-4">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
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
            <OptionGrid
              options={[...OUTFITS, ...myOutfits]}
              selectedId={outfit.id}
              onSelect={setOutfit}
              onUpload={(file) => addUpload(file, setMyOutfits, setOutfit)}
              uploadLabel="Upload your own outfit"
            />
          ) : (
            <OptionGrid
              options={[...BACKDROPS, ...myBackdrops]}
              selectedId={backdrop.id}
              onSelect={setBackdrop}
              onUpload={(file) => addUpload(file, setMyBackdrops, setBackdrop)}
              uploadLabel="Upload your own backdrop"
            />
          )}
        </div>
      </div>
    </div>
  );
}