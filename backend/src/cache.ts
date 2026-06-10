import Redis from 'ioredis';
import crypto from 'crypto';

// Connect to Redis — gracefully fall back if Redis is unavailable
let redis: Redis | null = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 2) return null; // Stop retrying after 2 attempts
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });

  redis.on('error', () => {
    console.log('⚠️  Redis unavailable — caching disabled (analyses will still work)');
    redis = null;
  });

  // Attempt connection
  redis.connect().catch(() => {
    redis = null;
  });
} catch {
  redis = null;
}

// Generate a deterministic cache key from the idea text
function getCacheKey(idea: string): string {
  const normalized = idea.trim().toLowerCase().replace(/\s+/g, ' ');
  const hash = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
  return `analysis:${hash}`;
}

// Cache TTL: 24 hours (in seconds)
const CACHE_TTL = 60 * 60 * 24;

export async function getCachedAnalysis(idea: string): Promise<any | null> {
  if (!redis) return null;
  try {
    const key = getCacheKey(idea);
    const cached = await redis.get(key);
    if (cached) {
      console.log(`✅ Cache HIT for idea: "${idea.slice(0, 40)}..."`);
      return JSON.parse(cached);
    }
    console.log(`❌ Cache MISS for idea: "${idea.slice(0, 40)}..."`);
    return null;
  } catch {
    return null;
  }
}

export async function setCachedAnalysis(idea: string, result: any): Promise<void> {
  if (!redis) return;
  try {
    const key = getCacheKey(idea);
    await redis.set(key, JSON.stringify(result), 'EX', CACHE_TTL);
    console.log(`💾 Cached analysis for: "${idea.slice(0, 40)}..."`);
  } catch {
    // Silently fail — caching is optional
  }
}
