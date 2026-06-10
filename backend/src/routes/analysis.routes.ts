import { Router } from 'express';
import { analyzeIdea, getHistory } from '../controllers/analysis.controller';

const router = Router();

router.post('/', analyzeIdea);
router.get('/history', getHistory);

export default router;
