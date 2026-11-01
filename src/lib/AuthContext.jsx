import React, { createContext, useState, useContext, useEffect } from 'react';
import { removeAccessToken } from '@base44/sdk';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredUser()));
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      try {
        const publicSettings = await base44.app.getPublicSettings();
        setAppPublicSettings(publicSettings);
      } catch (appError) {
        console.warn('Base44 app backend check unavailable; using local auth session:', appError);

        // Handle app-level errors if running on Base44 cloud
        if (appError?.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          // If in local dev or backend is offline, preserve local/Google OAuth session
          const stored = getStoredUser();
          if (stored) {
            setUser(stored);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } finally {
        setIsLoadingPublicSettings(false);
      }

      // The SDK can restore a session from storage or cookies after this module
      // has been initialized, so an appParams.token snapshot is not a reliable
      // indication of whether the user is signed in.
      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected auth check error:', error);
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (error.status === 401 || error.status === 403) {
          setAuthError({
            type: 'auth_required',
            message: 'Authentication required'
          });
        }
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    // Clear Base44 tokens
    removeAccessToken();
    removeAccessToken({ storageKey: 'token' });

    // Clear Google and Calendar local session data
    localStorage.removeItem('auth_user');
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('calendar_access_token');
    localStorage.removeItem('calendar_events');

    if (!shouldRedirect || typeof window === 'undefined') {
      return;
    }

    try {
      if (appParams.appBaseUrl && appParams.appId) {
        const logoutUrl = new URL('/api/apps/auth/logout', appParams.appBaseUrl || window.location.origin);
        logoutUrl.searchParams.set('from_url', window.location.origin + '/');
        await fetch(logoutUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-App-Id': String(appParams.appId || ''),
          },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      window.location.replace('/');
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      setIsAuthenticated,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
