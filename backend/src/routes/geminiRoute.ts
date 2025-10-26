import express from 'express';

import { analyzeCalendar } from '../controllers/geminiController';

const router = express.Router();

// Public analyze endpoint. If you want to require authentication, re-enable isAuthenticated middleware.
router.post('/analyze', analyzeCalendar);

export default router;
