import { Request, Response } from 'express';
import { createWorkflow } from '../ai/orchestrator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

export const analyzeIdea = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idea, audience, country, userId } = req.body;

    if (!idea) {
      res.status(400).json({ error: 'Startup idea is required' });
      return;
    }

    // Use passed userId, or create a guest user
    let actualUserId = userId;
    if (!actualUserId) {
      let guestUser = await prisma.user.findUnique({ where: { email: 'guest@launchlens.ai' } });
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: 'guest@launchlens.ai',
            password: 'guest_password',
            name: 'Guest User'
          }
        });
      }
      actualUserId = guestUser.id;
    }

    // 1. Create Project and Analysis in DB
    const project = await prisma.project.create({
      data: {
        userId: actualUserId,
        idea,
        audience,
        country
      }
    });

    const analysis = await prisma.analysis.create({
      data: {
        projectId: project.id,
        status: "PROCESSING"
      }
    });

    console.log(`Starting LangGraph AI Workflow for Analysis ${analysis.id}...`);
    const workflow = createWorkflow();
    const finalState = await workflow.invoke({
      idea,
      audience,
      country
    });

    // 2. Save Results back to DB
    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: "COMPLETED",
        score: finalState.viabilityScore?.score || null
      }
    });

    await prisma.report.create({
      data: {
        analysisId: analysis.id,
        content: finalState as any
      }
    });

    // 3. Log Competitors
    if (finalState.competitors?.competitors) {
      for (const comp of finalState.competitors.competitors) {
        await prisma.competitor.create({
          data: {
            analysisId: analysis.id,
            name: comp.name,
            strengths: [comp.strength],
            weaknesses: [comp.weakness]
          }
        });
      }
    }

    res.json({
      message: 'Analysis complete',
      analysisId: analysis.id,
      report: finalState
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error during AI analysis' });
  }
};
