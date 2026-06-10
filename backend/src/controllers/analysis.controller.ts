import { Request, Response } from 'express';
import { createWorkflow } from '../ai/orchestrator';

export const analyzeIdea = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idea, audience, country } = req.body;

    if (!idea) {
      res.status(400).json({ error: 'Startup idea is required' });
      return;
    }

    // In a production app, we would save the Analysis to the DB as "PROCESSING" here

    console.log("Starting LangGraph AI Workflow...");
    const workflow = createWorkflow();
    const finalState = await workflow.invoke({
      idea,
      audience,
      country
    });

    res.json({
      message: 'Analysis complete',
      report: finalState
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error during AI analysis' });
  }
};
