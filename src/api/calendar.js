/**
 * Google Calendar API Service
 * Fetches user schedule from Google Calendar and formats it into clean JSON schema.
 */

/**
 * Extracts a formatted 24-hour or local time string (e.g. "10:00") from an event.
 *
 * @param {Object} event - Raw Google Calendar event
 * @returns {string} Time string
 */
function extractEventTime(event) {
  if (event.start?.dateTime) {
    try {
      const d = new Date(event.start.dateTime);
      if (!isNaN(d.getTime())) {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    } catch {
      // fallback below
    }
  }
  return '09:00';
}

/**
 * Detects an intuitive meeting/event type based on event summary and description.
 *
 * @param {string} title - Event title/summary
 * @param {string} description - Event description
 * @returns {string} Detected type
 */
function detectEventType(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('keynote') || text.includes('speaking') || text.includes('presentation')) return 'Speaking';
  if (text.includes('panel') || text.includes('roundtable')) return 'Panel';
  if (text.includes('launch') || text.includes('announcement') || text.includes('milestone')) return 'Milestone';
  if (text.includes('podcast') || text.includes('interview') || text.includes('recording')) return 'Media';
  if (text.includes('1:1') || text.includes('one-on-one') || text.includes('sync')) return 'Sync';
  if (text.includes('onboarding')) return 'Onboarding';
  if (text.includes('workshop') || text.includes('training')) return 'Workshop';
  return 'Meeting';
}

/**
 * Maps a raw Google Calendar event object into the clean JSON schema.
 *
 * Target Schema:
 * {
 *   "id": "cal-0",
 *   "title": "Client Onboarding Sync",
 *   "date": "2026-11-02T10:00:00-05:00",
 *   "time": "10:00",
 *   "location": "Google Meet",
 *   "people": ["client@company.com", "manager@company.com"],
 *   "description": "Kickoff call to discuss the new marketing campaign requirements.",
 *   "type": "Meeting",
 *   "relevance": "High"
 * }
 *
 * @param {Object} event - Raw Google Calendar event resource
 * @param {number} [index=0] - Event index for fallback ID
 * @returns {Object} Formatted event object
 */
export function formatGoogleEvent(event, index = 0) {
  if (!event || typeof event !== 'object') {
    return {
      id: `cal-${index}`,
      title: 'Untitled Event',
      date: new Date().toISOString(),
      time: '09:00',
      location: 'Online',
      people: [],
      description: '',
      type: 'Meeting',
      relevance: 'Low',
      theme: 'Untitled Event',
      angle: 'No details provided.',
    };
  }

  // 1. ID
  const id = event.id || `cal-${index}`;

  // 2. Title
  const title = event.summary?.trim() || 'Untitled Event';

  // 3. Date & Time
  const date = event.start?.dateTime || event.start?.date || new Date().toISOString();
  const time = extractEventTime(event);

  // 4. People (extract emails from attendees)
  const people = Array.isArray(event.attendees)
    ? event.attendees
        .map((attendee) => attendee.email || attendee.displayName || '')
        .filter(Boolean)
    : [];

  // 5. Location
  const location =
    event.location ||
    (event.hangoutLink || event.conferenceData ? 'Google Meet' : '') ||
    (people.length > 0 ? 'Google Meet' : 'Online');

  // 6. Description
  const description = event.description?.trim() || '';

  // 7. Type
  const type = detectEventType(title, description);

  // 8. Relevance
  const relevance =
    people.length >= 2 || type === 'Speaking' || type === 'Panel' || type === 'Milestone'
      ? 'High'
      : people.length > 0
      ? 'Medium'
      : 'Low';

  return {
    id,
    title,
    date,
    time,
    location,
    people,
    description,
    type,
    relevance,
    theme: description.slice(0, 75) || title,
    angle: description || `Key takeaways and reflections from ${title}.`,
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
  return events.map((event, index) => formatGoogleEvent(event, index));
}

/**
 * Fetches the user's schedule from the Google Calendar /events endpoint
 * and maps the raw response data into the clean JSON schema.
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
    .map((event, index) => formatGoogleEvent(event, index));
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
