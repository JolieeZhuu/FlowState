import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

interface CalendarEvent {
  title: string;
  date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  type: string;
}

interface AnalysisContext {
  events: CalendarEvent[];
  analysis_goals: string[];
}

function prepareCalendarContext(events: CalendarEvent[]): AnalysisContext {
  const sortedEvents = [...events].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.start_time}`;
    const dateTimeB = `${b.date} ${b.start_time}`;
    if (dateTimeA < dateTimeB) return -1;
    if (dateTimeA > dateTimeB) return 1;
    return 0;
  });

  return {
    events: sortedEvents,
    analysis_goals: [
      'Identify scheduling conflicts',
      'Suggest optimal time management',
      'Recommend breaks between intense activities',
      'Detect workload imbalances',
    ],
  };
}

function createAnalysisPrompt(eventsData: AnalysisContext, extraQuestion?: string): string {
  const dataString = JSON.stringify(eventsData, null, 2);
  const base = `Analyze this user's calendar schedule and provide personalized suggestions:\n\n${dataString}\n\nPlease provide:\n1. Schedule optimization suggestions (e.g., better spacing of tasks)\n2. Workload balance recommendations\n3. Potential conflicts or overlaps\n4. Productivity tips based on their task types and patterns\n5. Suggested break times if schedule is too packed\n\nFormat your response as actionable, friendly suggestions. Do not use any latex, italicization, underlining, bold characters or markdown formatting. Keep it simple and clear. It needs to all be in plan text`;

  if (extraQuestion && extraQuestion.trim().length > 0) {
    return `${base}\n\nUser question: ${extraQuestion}`;
  }
  return base;
}

export async function analyzeCalendar(req: Request, res: Response) {
  try {
    const userEvents: CalendarEvent[] = req.body.events;
    const question: string | undefined = req.body.question;

    // Debug logging: help trace why frontend may send empty payloads
    console.log('geminiController: received body keys:', Object.keys(req.body || {}));
    console.log('geminiController: events payload (raw):', req.body.events);

    if (!userEvents || !Array.isArray(userEvents) || userEvents.length === 0) {
      console.warn('geminiController: No events provided or events empty');
      return res.status(400).json({ message: 'No events provided.' });
    }

    const apiKey = process.env.GEMINIKEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Server missing Gemini API key.' });
    }

    const client = new GoogleGenAI({ apiKey });

    const context = prepareCalendarContext(userEvents);
    const prompt = createAnalysisPrompt(context, question);

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const suggestionsText = (response as any).text ?? 'Analysis did not return text.';

    return res.status(200).json({ suggestions: suggestionsText, analyzed_events_count: userEvents.length });
  } catch (err) {
    console.error('Gemini analyze error:', err);
    return res.status(500).json({ message: 'Error analyzing calendar', error: err instanceof Error ? err.message : String(err) });
  }
}
