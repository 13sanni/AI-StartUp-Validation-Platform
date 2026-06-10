import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, END } from "@langchain/langgraph";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini Model
export const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the state structure that will be passed between agents
export interface StartupState {
  idea: string;
  audience?: string;
  country?: string;
  marketResearch?: any;
  competitors?: any;
  swot?: any;
  productMVP?: any;
  techStack?: any;
  viabilityScore?: any;
}

const graphState = {
  idea: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  audience: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  country: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  marketResearch: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
  competitors: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
  swot: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
  productMVP: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
  techStack: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
  viabilityScore: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
};

import { marketResearchAgent, competitorAgent, swotAgent, productManagerAgent, techArchitectAgent } from "./agents";

export const createWorkflow = () => {
  const workflow = new StateGraph({ channels: graphState })
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
