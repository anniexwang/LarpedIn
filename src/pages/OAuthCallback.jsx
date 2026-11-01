import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { fetchCalendarEvents } from '@/api/calendar';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Connecting to Google Calendar...');
  const [errorMessage, setErrorMessage] = useState('');

  // Extract return destination from state parameter if present
  const stateParam = searchParams.get('state');
  const destination = stateParam ? decodeURIComponent(stateParam) : '/calendar';

  // Prevent duplicate token exchange in React 18 StrictMode
  const exchangeStartedRef = useRef(false);

  useEffect(() => {
    if (exchangeStartedRef.current) return;
    exchangeStartedRef.current = true;

    async function handleExchange() {
      try {
        // Read code and any OAuth error parameters from the URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Google authorization error: ${error}`);
        }

        // If no code in query params, check for direct access_token (hash or query)
        if (!code) {
          const directToken =
            searchParams.get('access_token') ||
            new URLSearchParams(window.location.hash.replace(/^#/, '')).get('access_token');

          if (directToken) {
            await handleAccessTokenReceived(directToken);
            return;
          }

          throw new Error('No authorization code (?code=) found in callback URL.');
        }

        setMessage('Exchanging authorization code for access token...');

        // Clean env credentials (trim whitespace or quotes)
        const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').replace(/["']/g, '').trim();
        const clientSecret = (import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '').replace(/["']/g, '').trim();
        const redirectUri = (
          import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`
        ).replace(/["']/g, '').trim();

        // Token exchange request to Google OAuth token endpoint
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            ...(clientSecret ? { client_secret: clientSecret } : {}),
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenResponse.ok) {
          const errData = await tokenResponse.json().catch(() => ({}));
          throw new Error(
            errData.error_description ||
              errData.error ||
              `Token exchange failed with status ${tokenResponse.status}`
          );
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        if (!token) {
          throw new Error('No access token received from Google token exchange.');
        }

        await handleAccessTokenReceived(token);
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred during Google authentication.');
      }
    }

    async function handleAccessTokenReceived(token) {
      // 1. Save resulting access token to state
      setAccessToken(token);

      // 2. Save resulting access token to localStorage
      localStorage.setItem('google_access_token', token);
      localStorage.setItem('calendar_access_token', token);

      // Fetch user profile from Google to sign user into the app
      try {
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          localStorage.setItem('auth_user', JSON.stringify(profile));
        }
      } catch (profileErr) {
        console.warn('Could not fetch Google profile info:', profileErr);
      }

      setMessage('Fetching your schedule from Google Calendar...');

      // 3. Immediately call fetchCalendarEvents from calendar.js
      const schedule = await fetchCalendarEvents(token);

      setEvents(schedule);
      localStorage.setItem('calendar_events', JSON.stringify(schedule));
      setStatus('success');
      setMessage(`Calendar connected successfully! Found ${schedule.length} event${schedule.length === 1 ? '' : 's'}.`);
    }

    handleExchange();
  }, [searchParams]);

  const IconComponent =
    status === 'loading' ? Calendar : status === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <AuthLayout
      icon={IconComponent}
      title={
        status === 'loading'
          ? 'Connecting Calendar'
          : status === 'success'
          ? 'Calendar Connected'
          : 'Connection Failed'
      }
      subtitle={
        status === 'loading'
          ? 'Please wait while we complete Google verification...'
          : status === 'success'
          ? 'Your schedule is synced and ready.'
          : 'We could not complete the Google Calendar connection.'
      }
      footer={
        status === 'success' ? (
          <button
            type="button"
            onClick={() => navigate(destination)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full h-11 bg-primary text-primary-foreground font-medium text-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : status === 'error' ? (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full inline-flex items-center justify-center rounded-full h-11 border border-border bg-card text-foreground font-medium text-sm transition-colors hover:bg-secondary cursor-pointer"
          >
            Return to Login
          </button>
        ) : null
      }
    >
      <div className="space-y-4 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-9 w-9 animate-spin text-accent mb-4" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3 py-2 text-left">
            <p className="text-xs text-muted-foreground text-center">{message}</p>
            {events.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Upcoming Synced Events
                </p>
                {events.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="rounded-lg bg-card p-2 text-xs border border-border/50">
                    <p className="font-medium truncate">{item.title || 'Untitled Event'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {item.date ? new Date(item.date).toLocaleString() : 'No date'}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="py-2 text-center">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              {errorMessage}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Please check your Google OAuth credentials or try connecting again.
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
