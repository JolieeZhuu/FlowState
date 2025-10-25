import express from "express";
import { analyzeCalendar } from "../controllers/geminiController";
import { isAuthenticated } from "../middleware/auth";

const geminiRouter = express.Router();

// Apply authentication middleware to all routes
geminiRouter.use(isAuthenticated);

/**
 * @route POST /gemini/analyze
 * @desc Analyze user's calendar schedule and provide AI-based suggestions
 * @access Private (requires authentication)
 * 
 * Request Body Example:
 * {
 *   "events": [
 *     {
 *       "title": "Study Physics",
 *       "date": "2025-10-28",
 *       "day_of_week": "Tuesday",
 *       "start_time": "09:00",
 *       "end_time": "11:00",
 *       "type": "Study"
 *     },
 *     {
 *       "title": "Work Shift",
 *       "date": "2025-10-28",
 *       "day_of_week": "Tuesday",
 *       "start_time": "12:00",
 *       "end_time": "16:00",
 *       "type": "Work"
 *     }
 *   ]
 * }
 * 
 * Response Example:
 * {
 *   "suggestions": "Try spacing your study and work sessions with a 30-minute break...",
 *   "analyzed_events_count": 2
 * }
 */
geminiRouter.post("/analyze", analyzeCalendar);

// Export the router for use in the main server file
export default geminiRouter;
