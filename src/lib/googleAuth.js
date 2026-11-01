/**
 * Google OAuth Helper
 * Initiates Google OAuth 2.0 authentication flow.
 */

export function redirectToGoogleAuth(returnTo = '/calendar') {
  const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').replace(/["']/g, '').trim();
  const redirectUri = (
    import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`
  ).replace(/["']/g, '').trim();

  if (!clientId) {
    console.error('VITE_GOOGLE_CLIENT_ID is not configured in .env');
    alert('Google Client ID is missing. Please check your .env file.');
    return;
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  if (returnTo) {
    authUrl.searchParams.set('state', encodeURIComponent(returnTo));
  }

  window.location.href = authUrl.toString();
}

export default redirectToGoogleAuth;

