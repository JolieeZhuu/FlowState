import { GoogleGenAI } from "@google/genai"; // ✅ Correct import path
import { Request, Response } from "express";

/**
 * Represents a single calendar event in the user's schedule.
 */
interface CalendarEvent {
    title: string;
    date: string; // e.g., "10-28-2025"
    day_of_week: string; // e.g., "Monday"
    start_time: string; // e.g., "09:00"
    end_time: string; // e.g., "11:00"
    type: "Study" | "Work" | "Meeting" | "Personal" | string;
}

/**
 * Defines the structure of the data sent to Gemini for analysis.
 */
interface AnalysisContext {
    events: CalendarEvent[];
    analysis_goals: string[];
}

/**
 * Defines the structure of the result returned from Gemini.
 */
interface AnalysisResult {
    suggestions: string;
    analyzed_events_count: number;
}

// --- Helper Functions ---

/**
 * Sorts and prepares calendar events before sending them to Gemini.
 * @param events - Array of user calendar events.
 * @returns A structured and sorted context for analysis.
 */
function prepareCalendarContext(events: CalendarEvent[]): AnalysisContext {
    // Sort events chronologically by date and start time
    const sortedEvents = [...events].sort((a, b) => {
        const dateTimeA = `${a.date} ${a.start_time}`;
        const dateTimeB = `${b.date} ${b.start_time}`;
        if (dateTimeA < dateTimeB) return -1;
        if (dateTimeA > dateTimeB) return 1;
        return 0;
    });

    // Define the goals Gemini should analyze for
    return {
        events: sortedEvents,
        analysis_goals: [
            "Identify scheduling conflicts",
            "Suggest optimal time management",
            "Recommend breaks between intense activities",
            "Detect workload imbalances"
        ]
    };
}

/**
 * Creates a detailed natural language prompt for Gemini based on event data.
 * @param eventsData - Pre-processed events and analysis goals.
 * @returns A string prompt to send to the model.
 */
function createAnalysisPrompt(eventsData: AnalysisContext): string {
    const dataString = JSON.stringify(eventsData, null, 2);
    return `
Analyze this user's calendar schedule and provide personalized suggestions:

${dataString}

Please provide:
1. Schedule optimization suggestions (e.g., better spacing of tasks)
2. Workload balance recommendations
3. Potential conflicts or overlaps
4. Productivity tips based on their task types and patterns
5. Suggested break times if schedule is too packed

Format your response as actionable, friendly suggestions.
`;
}

// --- Main Controller Function ---

/**
 * @controller analyzeCalendar
 * @desc Uses Gemini AI to analyze a user's schedule and return suggestions.
 * @route POST /gemini/analyzeCalendar
 * @access Private
 */
export async function analyzeCalendar(req: Request, res: Response) {
    try {
        // Extract events from request body
        const userEvents: CalendarEvent[] = req.body.events;

        // Validate that events were provided
        if (!userEvents || userEvents.length === 0) {
            return res.status(400).json({ message: "No events provided." });
        }

        // --- Initialize Gemini Client ---
        // ⚠️ In production, store your key in an environment variable instead of hardcoding
        const HARDCODED_API_KEY = "AIzaSyD0eBTuwGUUsId5V8PEoKLhlcaADMJyFl8";
        const ai = new GoogleGenAI({ apiKey: HARDCODED_API_KEY });

        // --- Prepare Data and Prompt ---
        const context = prepareCalendarContext(userEvents);
        const prompt = createAnalysisPrompt(context);

        console.log("Sending prompt to Gemini...");

        // --- Send Request to Gemini Model ---
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // Ensure a valid text response from Gemini
        const suggestionsText = response.text ?? "Analysis failed to generate text content.";

        // --- Format and Return Final Response ---
        const result: AnalysisResult = {
            suggestions: suggestionsText,
            analyzed_events_count: userEvents.length,
        };

        return res.status(200).json(result);
    } 
    catch (error) {
        // Handle unexpected issues gracefully
        console.error("Error analyzing calendar:", error);
        return res.status(500).json({ message: "Error analyzing calendar", error });
    }
}
