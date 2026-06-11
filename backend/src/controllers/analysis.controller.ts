import { Request, Response } from 'express';
import { createWorkflow } from '../ai/orchestrator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getCachedAnalysis, setCachedAnalysis } from '../cache';

const prisma = new PrismaClient();

// Helper to log each agent step
async function logAgent(analysisId: string, agentName: string, input: any, runner: () => Promise<any>) {
  const start = Date.now();
  await prisma.agentLog.create({
    data: { analysisId, agentName, input, status: 'STARTED' }
  });
  try {
    const result = await runner();
    await prisma.agentLog.updateMany({
      where: { analysisId, agentName, status: 'STARTED' },
      data: { output: result, status: 'COMPLETED', executionMs: Date.now() - start }
    });
    return result;
  } catch (err: any) {
    await prisma.agentLog.updateMany({
      where: { analysisId, agentName, status: 'STARTED' },
      data: { output: { error: err.message }, status: 'FAILED', executionMs: Date.now() - start }
    });
    throw err;
  }
}

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
        try {
          const hashedPassword = await bcrypt.hash('guest_not_accessible', 10);
          guestUser = await prisma.user.create({
            data: {
              email: 'guest@launchlens.ai',
              password: hashedPassword,
              name: 'Guest User'
            }
          });
        } catch (err: any) {
          // If another concurrent request just created the user, fetch it instead
          if (err.code === 'P2002') {
            guestUser = await prisma.user.findUnique({ where: { email: 'guest@launchlens.ai' } });
          } else {
            throw err;
          }
        }
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

    // 2. Check Redis cache first
    let finalState = await getCachedAnalysis(idea);
    let totalMs = 0;

    if (finalState) {
      console.log(`⚡ Using cached result — skipping AI pipeline`);
    } else {
      // Run LangGraph workflow with agent logging
      const startTime = Date.now();
      const workflow = createWorkflow();
      finalState = await logAgent(analysis.id, 'LangGraph Pipeline', { idea, audience, country }, async () => {
        return await workflow.invoke({ idea, audience, country });
      });
      totalMs = Date.now() - startTime;
      console.log(`✅ AI Pipeline completed in ${(totalMs / 1000).toFixed(1)}s`);

      // Cache the result for future identical queries
      await setCachedAnalysis(idea, finalState);
    }

    // Log individual agent outputs for observability
    const agentOutputs = [
      { name: 'Market Research Agent', output: finalState.marketResearch },
      { name: 'Competitor Agent', output: finalState.competitors },
      { name: 'SWOT Agent', output: finalState.swot },
      { name: 'Product Manager Agent', output: finalState.productMVP },
      { name: 'Tech Architect Agent', output: finalState.techStack },
      { name: 'Scoring Agent', output: finalState.viabilityScore },
    ];

    for (const agent of agentOutputs) {
      if (agent.output) {
        await prisma.agentLog.create({
          data: {
            analysisId: analysis.id,
            agentName: agent.name,
            input: { idea },
            output: agent.output,
            status: 'COMPLETED',
            executionMs: Math.round(totalMs / agentOutputs.length)
          }
        });
      }
    }

    // 3. Save Results back to DB
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

    // 4. Log Competitors
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

// GET /api/analyze/history?userId=xxx
export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            reports: { take: 1 }
          }
        }
      }
    });

    const history = projects.map((p: any) => {
      const analysis = p.analyses[0];
      return {
        id: p.id,
        idea: p.idea,
        date: p.createdAt,
        score: analysis?.score || null,
        status: analysis?.status || 'PENDING',
        analysisId: analysis?.id || null,
        report: analysis?.reports[0]?.content || null,
      };
    });

    res.json({ history });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
