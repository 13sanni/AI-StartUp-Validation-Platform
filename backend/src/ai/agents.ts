import { z } from "zod";
import { llm, StartupState } from "./orchestrator";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export const marketResearchAgent = async (state: StartupState) => {
  console.log("--- Market Research Agent ---");
  const schema = z.object({
    marketTrend: z.string().describe("Overall trend of the market (e.g., Growing rapidly)"),
    targetUsers: z.array(z.string()).describe("List of target user personas"),
    painPoints: z.array(z.string()).describe("Key pain points the startup solves"),
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are an expert Market Research Analyst. Analyze the following startup idea.
Idea: {idea}
Target Audience: {audience}
Country: {country}`
  );

  const chain = prompt.pipe(llm.withStructuredOutput(schema)).withRetry({ stopAfterAttempt: 3 });
  const result = await chain.invoke({
    idea: state.idea,
    audience: state.audience || "Global",
    country: state.country || "Worldwide",
  });

  return { marketResearch: result };
};


export const competitorAgent = async (state: StartupState) => {
  console.log("--- Competitor Agent ---");
  
  let searchResults = "No live search results available. Rely on internal knowledge.";
  if (process.env.TAVILY_API_KEY) {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: `Top startup competitors for: ${state.idea}`,
          search_depth: "basic",
          max_results: 3
        })
      });
      const data = await response.json();
      searchResults = JSON.stringify(data.results || "No results found");
      console.log("Tavily search successful");
    } catch (e) {
      console.log("Tavily search failed, falling back to internal knowledge");
    }
  }

  const schema = z.object({
    competitors: z.array(
      z.object({
        name: z.string(),
        strength: z.string(),
        weakness: z.string(),
      })
    ),
    opportunity: z.string().describe("The gap or opportunity in the market"),
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are a Competitive Intelligence Agent. Identify competitors for this startup idea and find a market gap.
Idea: {idea}
Live Search Results: {searchResults}`
  );

  const chain = prompt.pipe(llm.withStructuredOutput(schema)).withRetry({ stopAfterAttempt: 3 });
  const result = await chain.invoke({
    idea: state.idea,
    searchResults: searchResults,
  });

  return { competitors: result };
};

export const swotAgent = async (state: StartupState) => {
  console.log("--- SWOT Agent ---");
  const schema = z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are a Strategic Business Consultant. Create a SWOT analysis for this startup.
Idea: {idea}
Market Info: {marketInfo}`
  );

  const chain = prompt.pipe(llm.withStructuredOutput(schema)).withRetry({ stopAfterAttempt: 3 });
  const result = await chain.invoke({
    idea: state.idea,
    marketInfo: JSON.stringify(state.marketResearch),
  });

  return { swot: result };
};

export const productManagerAgent = async (state: StartupState) => {
  console.log("--- Product Manager Agent ---");
  const schema = z.object({
    mvpFeatures: z.array(z.string()).describe("List of core features for version 1"),
    v2Features: z.array(z.string()).describe("List of features for version 2"),
    v3Features: z.array(z.string()).describe("List of features for version 3"),
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are a Senior Product Manager. Define the MVP and future roadmap.
Idea: {idea}`
  );

  const chain = prompt.pipe(llm.withStructuredOutput(schema)).withRetry({ stopAfterAttempt: 3 });
  const result = await chain.invoke({
    idea: state.idea,
  });

  return { productMVP: result };
};

export const techArchitectAgent = async (state: StartupState) => {
  console.log("--- Tech Architect Agent ---");
  const schema = z.object({
    frontend: z.string(),
    backend: z.string(),
    database: z.string(),
    cloud: z.string(),
    modules: z.array(z.string()).describe("Key software modules to build (e.g., Auth, Payments)"),
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are a Senior Software Architect. Recommend the optimal tech stack for this MVP.
Idea: {idea}
MVP Features: {mvp}`
  );

  const chain = prompt.pipe(llm.withStructuredOutput(schema)).withRetry({ stopAfterAttempt: 3 });
  const result = await chain.invoke({
    idea: state.idea,
    mvp: JSON.stringify(state.productMVP),
  });

  return { techStack: result };
};

export const scoringAgent = async (state: StartupState) => {
  console.log("--- Scoring Agent ---");
  const schema = z.object({
    score: z.number().min(1).max(100).describe("Overall viability score from 1 to 100"),
    reasoning: z.string().describe("Short explanation of the score"),
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are a seasoned Venture Capitalist. Based on the following analysis, score this startup idea's viability from 1 to 100.
Idea: {idea}
Market: {market}
SWOT: {swot}
Competitors: {competitors}`
  );

  const chain = prompt.pipe(llm.withStructuredOutput(schema)).withRetry({ stopAfterAttempt: 3 });
  const result = await chain.invoke({
    idea: state.idea,
    market: JSON.stringify(state.marketResearch),
    swot: JSON.stringify(state.swot),
    competitors: JSON.stringify(state.competitors),
  });

  return { viabilityScore: result };
};
