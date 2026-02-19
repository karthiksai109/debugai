import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { analyzeInput } from '../services/ai.js';
import { insertAnalysis, updateAnalysisResult, markAnalysisFailed, getAnalysis, listAnalyses, getStats } from '../services/db.js';

const router = Router();

router.get('/analyses/stats', (req, res) => {
  const stats = getStats();
  res.json(stats);
});

router.get('/analyses', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  const analyses = listAnalyses(limit, offset);
  res.json(analyses);
});

router.get('/analyses/:id', (req, res) => {
  const analysis = getAnalysis(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  res.json(analysis);
});

router.post('/analyses', async (req, res, next) => {
  try {
    const { input_text, source = 'api' } = req.body;
    if (!input_text || !input_text.trim()) {
      return res.status(400).json({ error: 'input_text is required' });
    }

    const id = uuidv4();

    insertAnalysis({
      id,
      source,
      channel_id: null,
      user_id: null,
      user_name: req.body.user_name || 'api_user',
      input_text
    });

    const result = await analyzeInput(input_text);
    updateAnalysisResult({ id, ...result });

    const analysis = getAnalysis(id);
    res.status(201).json(analysis);
  } catch (err) {
    next(err);
  }
});

export default router;
