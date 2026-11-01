/**
 * Google Calendar API Service
 * Fetches user schedule from Google Calendar and formats it into clean JSON schema.
 */

/**
 * Maps a raw Google Calendar event object into the clean JSON schema.
 *
 * Target Schema:
 * {
 *   "title": "Client Onboarding Sync",
 *   "date": "2026-11-02T10:00:00-05:00",
 *   "people": ["client@company.com", "manager@company.com"],
 *   "location": "Google Meet",
 *   "description": "Kickoff call to discuss the new marketing campaign requirements."
 * }
 *
 * @param {Object} event - Raw Google Calendar event resource
 * @returns {Object} Formatted event object
 */
export function formatGoogleEvent(event) {
  if (!event || typeof event !== 'object') {
    return {
      title: '',
      date: '',
      people: [],
      location: '',
      description: '',
    };
  }

  // Extract attendee email addresses (or fallback to displayName if available)
  const people = Array.isArray(event.attendees)
    ? event.attendees
        .map((attendee) => attendee.email || attendee.displayName || '')
        .filter(Boolean)
    : [];

  // Determine event date/time (timed events have dateTime, all-day events have date)
  const date = event.start?.dateTime || event.start?.date || '';

  // Determine location (fallback to 'Google Meet' if hangoutLink / conferenceData is present)
  const location =
    event.location ||
    (event.hangoutLink || event.conferenceData ? 'Google Meet' : '') ||
    '';

  return {
    title: event.summary || '',
    date,
    people,
    location,
    description: event.description || '',
  };
}

/**
 * Formats an array of raw Google Calendar events into clean JSON schema objects.
 *
 * @param {Array<Object>} events - Array of raw Google Calendar event items
 * @returns {Array<Object>} Formatted events matching the schema
 */
export function formatCalendarEvents(events = []) {
  if (!Array.isArray(events)) return [];
  return events.map((event) => formatGoogleEvent(event));
}

/**
 * Fetches the user's schedule from the Google Calendar /events endpoint
 * and maps the raw response data into the clean JSON schema for Person 3.
 *
 * @param {string} accessToken - Google OAuth 2.0 access token
 * @param {Object} [options={}] - Query and calendar options
 * @param {string} [options.calendarId='primary'] - Target calendar ID (default: 'primary')
 * @param {string} [options.timeMin] - ISO 8601 string lower bound for event start/end (defaults to now)
 * @param {string} [options.timeMax] - Optional ISO 8601 string upper bound
 * @param {number} [options.maxResults=50] - Maximum number of events to return
 * @param {boolean} [options.singleEvents=true] - Expand recurring events into individual instances
 * @param {string} [options.orderBy='startTime'] - Order of returned events ('startTime' or 'updated')
 * @returns {Promise<Array<Object>>} Formatted events matching the clean JSON schema
 */
export async function fetchCalendarEvents(accessToken, options = {}) {
  if (!accessToken) {
    throw new Error('Access token is required to fetch calendar events.');
  }

  const {
    calendarId = 'primary',
    timeMin = new Date().toISOString(),
    timeMax,
    singleEvents = true,
    orderBy = 'startTime',
    maxResults = 50,
    ...extraParams
  } = options;

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
  );

  const params = {
    singleEvents: String(singleEvents),
    orderBy,
    ...(timeMin ? { timeMin } : {}),
    ...(timeMax ? { timeMax } : {}),
    ...(maxResults ? { maxResults: String(maxResults) } : {}),
    ...extraParams,
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Google Calendar API error (${response.status} ${response.statusText}): ${errorBody}`
    );
  }

  const data = await response.json();
  const rawEvents = data.items || [];

  // Format Google's raw data into the clean JSON schema using .map()
  return rawEvents
    .filter((event) => event.status !== 'cancelled')
    .map((event) => formatGoogleEvent(event));
}

// Aliases for compatibility
export {
  fetchCalendarEvents as getCalendarEvents,
  fetchCalendarEvents as fetchSchedule,
  fetchCalendarEvents as getSchedule,
  formatGoogleEvent as mapGoogleEvent,
  formatCalendarEvents as formatGoogleEvents,
};

export default fetchCalendarEvents;

