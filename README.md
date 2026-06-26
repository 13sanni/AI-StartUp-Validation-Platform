# 🔭 LaunchLens — AI Startup Validation Platform

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-FF6F00)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

## Live Demo
[https://ai-start-up-validation-platform-htf.vercel.app/](https://ai-start-up-validation-platform-htf.vercel.app/)

## Overview
Validate any startup idea in 60 seconds with a multi-agent AI system that performs market research, competitor analysis, SWOT evaluation, MVP planning, and viability scoring.

## Features
- **6-Agent AI Pipeline** — Market Research, Competitor Analysis, SWOT, Product Manager, Tech Architect, and VC Scoring agents orchestrated via LangGraph
- **Live Web Search** — Competitor agent uses Tavily API to find real, current competitors
- **Viability Score** — VC-style 1-100 scoring with reasoning
- **Full Authentication** — JWT-based register/login with bcrypt password hashing
- **PostgreSQL Persistence** — All analyses, reports, competitors, and agent logs saved to database
- **Redis Caching** — Identical startup ideas are served from cache, saving API credits and time
- **Agent Observability** — Every agent execution is logged with inputs, outputs, status, and execution time
- **PDF Export** — Download any analysis report as a styled PDF document
- **Beautiful UI** — Glassmorphism dark theme with Framer Motion animations
- **Docker Ready** — One command to spin up the entire stack (PostgreSQL + Redis + Backend + Frontend)

## Screenshots
![Screenshot 1](./assests/Screenshot%20(127).png)
![Screenshot 2](./assests/Screenshot%20(128).png)
![Screenshot 3](./assests/Screenshot%20(129).png)
![Screenshot 4](./assests/Screenshot%20(130).png)
![Screenshot 5](./assests/Screenshot%20(131).png)
![Screenshot 6](./assests/Screenshot%20(132).png)

## Architecture Diagram
```text
Frontend (React + Vite)
    │
    ▼
Express API Gateway
    │
    ├── POST /api/auth/register
    ├── POST /api/auth/login
    ├── POST /api/analyze
    └── GET  /api/analyze/history
          │
          ▼
    LangGraph Orchestrator
          │
          ├── Market Research Agent
          ├── Competitor Agent (+ Tavily Web Search)
          ├── SWOT Agent
          ├── Product Manager Agent
          ├── Tech Architect Agent
          └── Scoring Agent
                │
                ▼
          PostgreSQL (Prisma ORM)
          ├── User, Project, Analysis
          ├── Report, Competitor
          └── AgentLog (Observability)
```

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, html2pdf.js |
| Backend | Express.js, TypeScript, JWT, bcrypt |
| AI Engine | LangChain, LangGraph, Google Gemini, Tavily Search |
| Database | PostgreSQL, Prisma 7 ORM |
| Caching | Redis 7 (ioredis) |
| DevOps | Docker, Docker Compose |

## Folder Structure
```text
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── agents.ts          # 6 AI agents
│   │   │   └── orchestrator.ts    # LangGraph pipeline
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── analysis.controller.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── analysis.routes.ts
│   │   ├── cache.ts               # Redis caching layer
│   │   └── index.ts               # Express server
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── prisma.config.ts
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── AnalysisPage.jsx   # Live analysis UI
│   │   │   ├── ReportPage.jsx     # Full report view
│   │   │   ├── Dashboard.jsx      # User history
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   └── store/                 # Redux auth
│   ├── Dockerfile
│   └── index.html
├── docker-compose.yml
└── .gitignore
```

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL installed and running
- Google Gemini API Key ([Get one free](https://aistudio.google.com/app/apikey))

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/AI-StartUp-Validation-Platform.git
cd AI-StartUp-Validation-Platform

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables

Edit `backend/.env` based on `backend/.env.example`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/startup_platform?schema=public"
JWT_SECRET="your_secret_key"
PORT=5000
GOOGLE_API_KEY="your_gemini_api_key"
TAVILY_API_KEY="your_tavily_key_optional"
```

## Running Locally

### 1. Setup Database
```bash
cd backend
npx prisma db push
```

### 2. Run
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** and validate your first idea!

### Docker (Alternative)
```bash
# Set your API keys
export GOOGLE_API_KEY="your_key"
export TAVILY_API_KEY="your_key"

# Launch everything
docker-compose up --build
```

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive JWT
- `POST /api/analyze` - Submit a new startup idea for validation
- `GET /api/analyze/history` - Retrieve past analyses history

## Database Schema
- **User**: `id`, `email`, `password`, `name`, `createdAt`, `updatedAt`
- **Project**: `id`, `userId`, `idea`, `audience`, `country`, `createdAt`, `updatedAt`
- **Analysis**: `id`, `projectId`, `status`, `score`, `createdAt`, `updatedAt`
- **Report**: `id`, `analysisId`, `content`, `createdAt`, `updatedAt`
- **Competitor**: `id`, `analysisId`, `name`, `strengths`, `weaknesses`, `createdAt`
- **AgentLog**: `id`, `analysisId`, `agentName`, `input`, `output`, `status`, `executionMs`, `createdAt`

## Design Decisions
- **Micro-agent Architecture**: Utilized LangGraph to create a pipeline of specialized agents (Market Research, Competitor Analysis, SWOT, etc.) rather than a single monolithic LLM prompt, ensuring higher quality and more structured outputs.
- **Tavily Integration**: Integrated Tavily API for real-time web search specifically for the competitor agent to fetch up-to-date market rivals.
- **Redis Caching**: Implemented Redis to cache identical startup idea analyses to save API usage and significantly reduce response times.

## Performance Optimizations
- **Parallel Agent Execution**: Optimized LangGraph workflow to run independent agents in parallel where possible.
- **Database Indexing**: Indexed critical fields in PostgreSQL to speed up query times.
- **Frontend State Management**: Utilized Redux Toolkit for efficient state updates and minimizing unnecessary re-renders in React.

## Security Features
- **Authentication**: JWT-based authentication with bcrypt hashing for passwords.
- **Environment Variables**: Sensitive keys (API keys, database URLs) are kept securely in `.env` files.
- **Data Isolation**: User analyses are strictly tied to `userId` using Prisma relationships.

## Future Improvements
- **Payment Gateway Integration**: Add Stripe for premium features.
- **Team Collaboration**: Allow multiple users to collaborate on a single startup validation project.
- **Custom Agent Prompts**: Let users tweak the persona or focus of specific AI agents.

## Challenges Faced
- **LLM Hallucinations**: Managing and prompting the models effectively to prevent generating fake competitors. Solved by integrating real-time search tools (Tavily).
- **Long Execution Times**: The analysis process can take time. Mitigated by adding Redis caching and optimizing agent prompts.

## Lessons Learned
- Orchestrating multiple LLM agents requires robust error handling and structured output parsing.
- Breaking down a large task into smaller, specialized agents yields significantly better results than a zero-shot prompt
