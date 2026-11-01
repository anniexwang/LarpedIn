import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ConnectCard from '@/components/calendar/ConnectCard';
import ConnectedPanel from '@/components/calendar/ConnectedPanel';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import { EVENTS } from '@/lib/mockData';
import { redirectToGoogleAuth } from '@/lib/googleAuth';

export default function CalendarPage() {
  const [connected, setConnected] = useState(() => {
    return Boolean(
      localStorage.getItem('google_access_token') ||
      localStorage.getItem('calendar_access_token')
    );
  });
  const [prefs, setPrefs] = useState({ suggest: true, remind: true, linkedin: false });
  const { toast } = useToast();
  const { user } = useAuth();
  const account = user?.email || 'you@larpedin.com';

  const connect = () => {
    redirectToGoogleAuth('/calendar');
  };

  const toggle = (id) => {
    setPrefs((current) => ({ ...current, [id]: !current[id] }));
  };

  const disconnect = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('calendar_access_token');
    localStorage.removeItem('calendar_events');
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
