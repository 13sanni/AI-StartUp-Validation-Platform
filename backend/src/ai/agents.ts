import { z } from "zod";
import { llm, StartupState } from "./orchestrator";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export const marketResearchAgent = async (state: StartupState) => {
  console.log("--- Market Research Agent ---");
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      marketTrend: z.string().describe("Overall trend of the market (e.g., Growing rapidly)"),
      targetUsers: z.array(z.string()).describe("List of target user personas"),
      painPoints: z.array(z.string()).describe("Key pain points the startup solves"),
    })
  );

  const prompt = PromptTemplate.fromTemplate(
    `You are an expert Market Research Analyst. Analyze the following startup idea.
Idea: {idea}
Target Audience: {audience}
Country: {country}

{format_instructions}`
  );

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    idea: state.idea,
    audience: state.audience || "Global",
    country: state.country || "Worldwide",
    format_instructions: parser.getFormatInstructions(),
  });

  return { marketResearch: result };
};

export const competitorAgent = async (state: StartupState) => {
  console.log("--- Competitor Agent ---");
  // For Phase 3, we will integrate real web search here.
  // For now, we use Gemini's internal knowledge.
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      competitors: z.array(
        z.object({
          name: z.string(),
          strength: z.string(),
          weakness: z.string(),
        })
      ),
      opportunity: z.string().describe("The gap or opportunity in the market"),
    })
  );

  const prompt = PromptTemplate.fromTemplate(
    `You are a Competitive Intelligence Agent. Identify competitors for this startup idea and find a market gap.
Idea: {idea}

{format_instructions}`
  );

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    idea: state.idea,
    format_instructions: parser.getFormatInstructions(),
  });

  return { competitors: result };
};

export const swotAgent = async (state: StartupState) => {
  console.log("--- SWOT Agent ---");
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      opportunities: z.array(z.string()),
      threats: z.array(z.string()),
    })
  );

  const prompt = PromptTemplate.fromTemplate(
    `You are a Strategic Business Consultant. Create a SWOT analysis for this startup.
Idea: {idea}
Market Info: {marketInfo}

{format_instructions}`
  );

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    idea: state.idea,
    marketInfo: JSON.stringify(state.marketResearch),
    format_instructions: parser.getFormatInstructions(),
  });

  return { swot: result };
};

export const productManagerAgent = async (state: StartupState) => {
  console.log("--- Product Manager Agent ---");
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      mvpFeatures: z.array(z.string()).describe("List of core features for version 1"),
      v2Features: z.array(z.string()).describe("List of features for version 2"),
      v3Features: z.array(z.string()).describe("List of features for version 3"),
    })
  );

  const prompt = PromptTemplate.fromTemplate(
    `You are a Senior Product Manager. Define the MVP and future roadmap.
Idea: {idea}

{format_instructions}`
  );

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    idea: state.idea,
    format_instructions: parser.getFormatInstructions(),
  });

  return { productMVP: result };
};

export const techArchitectAgent = async (state: StartupState) => {
  console.log("--- Tech Architect Agent ---");
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      frontend: z.string(),
      backend: z.string(),
      database: z.string(),
      cloud: z.string(),
      modules: z.array(z.string()).describe("Key software modules to build (e.g., Auth, Payments)"),
    })
  );

  const prompt = PromptTemplate.fromTemplate(
    `You are a Senior Software Architect. Recommend the optimal tech stack for this MVP.
Idea: {idea}
MVP Features: {mvp}

{format_instructions}`
  );

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    idea: state.idea,
    mvp: JSON.stringify(state.productMVP),
    format_instructions: parser.getFormatInstructions(),
  });

  return { techStack: result };
};
