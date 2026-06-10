import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, END, Annotation } from "@langchain/langgraph";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini Model
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_API_KEY,
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

import { marketResearchAgent, competitorAgent, swotAgent, productManagerAgent, techArchitectAgent } from "./agents";

export const createWorkflow = () => {
  const workflow = new StateGraph(GraphState)
    .addNode("marketResearch", marketResearchAgent)
    .addNode("competitorAnalysis", competitorAgent)
    .addNode("swotAnalysis", swotAgent)
    .addNode("productManager", productManagerAgent)
    .addNode("techArchitect", techArchitectAgent)

    .addEdge("__start__", "marketResearch")
    .addEdge("marketResearch", "competitorAnalysis")
    .addEdge("competitorAnalysis", "swotAnalysis")
    .addEdge("swotAnalysis", "productManager")
    .addEdge("productManager", "techArchitect")
    .addEdge("techArchitect", "__end__");

  return workflow.compile();
};
