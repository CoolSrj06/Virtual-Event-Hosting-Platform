const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(`Backend URL: ${backendUrl}`);

export class RDSService {
  // Fetch all events
  public static async getEvents() {
    const result = await fetch(`${backendUrl}/events/allEvents`)
    if(!result.ok) {
      throw new Error('Failed to fetch events')
    }
    return result.json()
  }

  // Fetch a specific event by ID
  public static async getEvent(eventId: string) {
    const result = await fetch(`${backendUrl}/events/${eventId}`)
    if (!result.ok) {
      throw new Error('Failed to fetch event')
    }
    return result.json();
  }

  // // Fetch all sessions for an event
  public static async getSessionsForEvent(eventId: string) {
    console.log(`Fetching sessions for event ID: ${eventId}`);
    
    const result = await fetch(`${backendUrl}/events/${eventId}/sessions`)
    return result.json();
  }

  // // Fetch questions for a session
  public static async getQuestionsForSession(sessionId: string) {
    const result = await fetch(`${backendUrl}/sessions/${sessionId}/questions`)
    return result
  };
  

  // // Submit a question for a session
  public static async submitQuestion(sessionId: string, questionText: string, username: string = 'Anonymous') {
    const result = await fetch(`${backendUrl}/sessions/${sessionId}/analytics`)
    return result.json();
  }

  // Fetch analytics for a session
  public static async getAnalyticsForSession(sessionId: string) {
    const result = await fetch(`${backendUrl}/sessions/${sessionId}/analytics`)
    return result.json();
  }
}

export default RDSService;
