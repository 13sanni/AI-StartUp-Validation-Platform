import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import analysisRoutes from './routes/analysis.routes';

dotenv.config();

// ─── Startup Validation ─────────────────────────────────
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'GOOGLE_API_KEY'] as const;
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ FATAL: Missing required environment variable: ${key}`);
    console.error('   Please set it in your .env file and restart the server.');
    process.exit(1);
  }
}

if (process.env.JWT_SECRET === 'your_super_secret_jwt_key' || process.env.JWT_SECRET === 'fallback_secret') {
  console.error('❌ FATAL: JWT_SECRET is still a placeholder. Generate a real secret:');
  console.error('   Run: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// ─── Security Middleware ─────────────────────────────────
app.use(helmet());

// CORS — restrict to frontend origin
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body size limits — prevent large payload attacks
app.use(express.json({ limit: '1mb' }));

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints — 20 per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analysisRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
