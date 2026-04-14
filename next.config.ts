import type { NextConfig } from "next";

/* ─────────────────────────────────────────────────────────────────────────────
 * SECURITY HEADERS
 * Applied to every response via headers() config.
 *
 * IMPLEMENTATION NOTES:
 *   - X-Frame-Options    → prevents clickjacking
 *   - X-Content-Type     → prevents MIME sniffing
 *   - Referrer-Policy    → limits referrer leakage
 *   - Permissions-Policy → disables unnecessary browser features
 *   - HSTS               → forces HTTPS (browsers cache for 2 years after first visit)
 *   - CSP                → restricts resource origins; 'unsafe-inline' is required
 *                          by Next.js for its inline scripts/styles. For stronger
 *                          CSP use nonces (next.config nonce support) — TODO for v2.
 *
 * LEGAL REVIEW REQUIRED: Verify CSP doesn't break any third-party widget you add
 * later (payment gateway iframes, analytics, chat widgets).
 * ─────────────────────────────────────────────────────────────────────────── */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    // Only sent over HTTPS. Safe to include; ignored over HTTP.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // FIX H3 — unsafe-eval is only needed in development (fast-refresh).
      // Production builds use pre-compiled code and don't need eval().
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline'",
      // Tailwind injects inline styles; Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Unsplash images; data: URIs for base64 placeholders
      "img-src 'self' data: https://images.unsplash.com",
      // API calls only to same origin
      "connect-src 'self'",
      // No iframes from external sources
      "frame-src 'none'",
      "frame-ancestors 'none'",
      // No plugins
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
