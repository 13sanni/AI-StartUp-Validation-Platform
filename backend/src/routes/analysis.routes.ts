import { Router } from 'express';
import { analyzeIdea } from '../controllers/analysis.controller';

const router = Router();

router.post('/', analyzeIdea);

export default router;
