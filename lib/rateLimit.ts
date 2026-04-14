/**
 * lib/rateLimit.ts
 *
 * Simple in-memory rate limiter for API routes.
 *
 * SECURITY NOTES:
 *   - This works correctly when Next.js runs as a single long-lived process
 *     (local dev, self-hosted Node server).
 *   - On Vercel/AWS Lambda (serverless), each function invocation may be a
 *     fresh process, so the Map resets. For production rate limiting on
 *     serverless, replace this with Upstash Redis:
 *       https://upstash.com/blog/nextjs-rate-limiting
 *   - Rate limiting by IP is a best-effort defence; determined attackers can
 *     rotate IPs. Combine with CAPTCHA (e.g. hCaptcha) for stronger protection.
 *
 * CURRENT LIMITS:
 *   - Checkout: max 5 requests per IP per 10 minutes.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

/** Clean up expired buckets to avoid memory growth in long-running processes. */
function cleanup() {
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (bucket.resetAt < now) store.delete(key);
  }
}

/**
 * Check whether the given key is within the allowed limit.
 * @param key    Usually an IP address + route identifier.
 * @param limit  Maximum requests allowed in the window.
 * @param windowMs  Time window in milliseconds.
 * @returns `true` if the request is allowed, `false` if rate-limited.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  // Periodic cleanup (every ~50 checks to avoid O(n) every call)
  if (Math.random() < 0.02) cleanup();

  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
