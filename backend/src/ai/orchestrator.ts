import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation } from "@langchain/langgraph";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini Model
// NOTE: Retry logic is handled per-chain in agents.ts via .withRetry()
// Do NOT add maxRetries here — it would compound with chain-level retries
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

export const GraphState = Annotation.Root({
  idea: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  audience: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  country: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  marketResearch: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  competitors: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  swot: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  productMVP: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  techStack: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  viabilityScore: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});

export type StartupState = typeof GraphState.State;

import { marketResearchAgent, competitorAgent, swotAgent, productManagerAgent, techArchitectAgent, scoringAgent } from "./agents";

export const createWorkflow = () => {
  const workflow = new StateGraph(GraphState)
    .addNode("marketResearchNode", marketResearchAgent)
    .addNode("competitorAnalysisNode", competitorAgent)
    .addNode("swotAnalysisNode", swotAgent)
    .addNode("productManagerNode", productManagerAgent)
    .addNode("techArchitectNode", techArchitectAgent)
    .addNode("scoringNode", scoringAgent)

    .addEdge("__start__", "marketResearchNode")
    .addEdge("marketResearchNode", "competitorAnalysisNode")
    .addEdge("competitorAnalysisNode", "swotAnalysisNode")
    .addEdge("swotAnalysisNode", "productManagerNode")
    .addEdge("productManagerNode", "techArchitectNode")
    .addEdge("techArchitectNode", "scoringNode")
    .addEdge("scoringNode", "__end__");

  return workflow.compile();
};
