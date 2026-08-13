import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
// It automatically picks up UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const now = Date.now();
    // 60 seconds threshold (anyone who hasn't pinged in 60s is considered offline)
    const threshold = now - 60000;

    const pipeline = redis.pipeline();

    // 1. Add/Update the current user's session with the current timestamp
    pipeline.zadd('online_users', { score: now, member: sessionId });

    // 2. Remove all sessions that are older than 60 seconds
    pipeline.zremrangebyscore('online_users', 0, threshold);

    // 3. Count how many users are currently in the set
    pipeline.zcard('online_users');

    const results = await pipeline.exec();
    
    // The result of zcard is the last item in the pipeline results array
    const activeUsers = results[2] as number;

    return NextResponse.json({ activeUsers });
  } catch (error) {
    console.error('Error in presence API:', error);
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
  }
}
