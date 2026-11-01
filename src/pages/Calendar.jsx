import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ConnectCard from '@/components/calendar/ConnectCard';
import ConnectedPanel from '@/components/calendar/ConnectedPanel';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import { EVENTS } from '@/lib/mockData';

export default function CalendarPage() {
  const [connected, setConnected] = useState(false);
  const [prefs, setPrefs] = useState({ suggest: true, remind: true, linkedin: false });
  const { toast } = useToast();
  const { user } = useAuth();
  const account = user?.email || 'you@larpedin.com';

  const connect = () => {
    setConnected(true);
    toast({ title: 'Google Calendar connected', description: 'Read-only access · 5 events this fortnight.' });
  };

  const toggle = (id) => {
    setPrefs((current) => ({ ...current, [id]: !current[id] }));
  };

  const disconnect = () => {
    setConnected(false);
    toast({ title: 'Calendar disconnected', description: 'LarpedIn can no longer read your events.' });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Calendar"
        title="Signals, not noise."
        description="Your calendar already knows what is worth talking about. LarpedIn turns the right events into drafts you would actually publish."
      />

      <div className="pt-6">
        {connected ? (
          <ConnectedPanel
            account={account}
            prefs={prefs}
            onToggle={toggle}
            onDisconnect={disconnect}
            onRefresh={() =>
              toast({ title: 'Calendar synced', description: 'Everything is up to date.' })
            }
          />
        ) : (
          <ConnectCard onConnect={connect} preview={EVENTS.slice(0, 3)} />
        )}
      </div>
    </div>
  );
}