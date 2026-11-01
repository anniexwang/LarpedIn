import { format, parseISO } from 'date-fns';
import localCalendarJson from '@/data/calendar.json';
import { formatGoogleEvent } from '@/api/calendar';

/**
 * Normalizes an event object so all UI components and post composers can read it consistently.
 *
 * @param {Object} event - Raw or mapped calendar event
 * @param {number} [index=0] - Fallback index for key generation
 * @returns {Object} Clean normalized event
 */
export function normalizeCalendarEvent(event, index = 0) {
  return formatGoogleEvent(event, index);
}

/**
 * Gets the current active calendar events:
 * 1. Checks localStorage for live synced Google Calendar events.
 * 2. If allowFallback is true and no live events are found, checks src/data/calendar.json.
 * 3. Returns empty array if no real events are available (NO hardcoding).
 *
 * @param {Object} [options={}]
 * @param {boolean} [options.allowFallback=true] - Whether to fall back to calendar.json if no Google events are synced
 * @returns {Array<Object>} Normalized calendar events
 */
export function getCalendarEvents(options = {}) {
  const { allowFallback = true } = options;

  // 1. Try reading live synced Google Calendar events from localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('calendar_events');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => normalizeCalendarEvent(item, idx));
        }
      }
    } catch (e) {
      console.warn('Could not read calendar_events from localStorage:', e);
    }
  }

  // 2. Try reading from custom calendar.json if fallback allowed
  if (allowFallback && Array.isArray(localCalendarJson) && localCalendarJson.length > 0) {
    return localCalendarJson.map((item, idx) => normalizeCalendarEvent(item, idx));
  }

  return [];
}

/**
 * Stores custom or freshly fetched calendar events to localStorage.
 *
 * @param {Array<Object>} events - Array of calendar events to store
 */
export function setCalendarEvents(events) {
  if (typeof window !== 'undefined' && Array.isArray(events)) {
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }
}

/**
 * Checks if a real Google Calendar is connected.
 *
 * @returns {boolean} True if Google access token is present
 */
export function isGoogleCalendarConnected() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    localStorage.getItem('google_access_token') ||
    localStorage.getItem('calendar_access_token')
  );
}
