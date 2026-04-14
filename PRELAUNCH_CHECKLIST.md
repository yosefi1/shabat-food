# Pre-Launch Checklist — שבת פוד

> Complete every item before going live. Items marked 🔴 are blocking.
> Items marked 🟡 are important but can be done post-launch within 30 days.
> Items marked 🟢 are done (code is in place, just needs configuration).

---

## 🔒 Security

| Status | Item | Notes |
|--------|------|-------|
| 🟢 | Security HTTP headers (CSP, X-Frame-Options, HSTS, etc.) | In `next.config.ts` |
| 🟢 | Input validation on server side | `app/api/checkout/route.ts` |
| 🟢 | Input sanitization (XSS prevention) | `lib/sanitize.ts` |
| 🟢 | Rate limiting on checkout API | `lib/rateLimit.ts` — upgrade to Redis for Vercel |
| 🔴 | Configure `.env.local` with real secrets | Copy `.env.example`, fill values |
| 🔴 | Ensure `.env.local` is in `.gitignore` | Never commit secrets |
| 🟡 | Add CAPTCHA to order form | hCaptcha or Cloudflare Turnstile — prevents order spam |
| 🟡 | Upgrade rate limiting to Redis | Required for Vercel/serverless |
| 🟡 | Set up payment webhook signature verification | When payment gateway is connected |
| 🟡 | Enable Vercel WAF or Cloudflare | Adds DDoS and bot protection |
| 🟡 | Run dependency audit: `npm audit` | Fix high/critical vulnerabilities |
| 🔴 | Verify HTTPS is enforced on hosting | Vercel does this automatically |
| 🟡 | Configure CORS if needed | Currently only same-origin requests |

---

## 📧 Email & Orders

| Status | Item | Notes |
|--------|------|-------|
| 🔴 | Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in `.env.local` | Without this, no confirmation emails are sent |
| 🔴 | Set `EMAIL_BUSINESS` to owner email | Owner notification emails |
| 🔴 | Test email sending end-to-end | Place a test order and verify receipt |
| 🔴 | Set up order persistence | Either `ORDERS_FILE_PATH` (VPS) or Supabase/DB (Vercel) |
| 🟡 | Set up email deliverability (SPF / DKIM / DMARC) | Prevents confirmation emails landing in spam |
| 🟡 | Consider transactional email service | Resend / SendGrid / Amazon SES — better than Gmail SMTP |

---

## ⚖️ Legal (REQUIRES LAWYER REVIEW 🔴)

| Status | Item | Notes |
|--------|------|-------|
| 🔴 | Privacy Policy — lawyer review and approval | `app/legal/privacy/page.tsx` — template only |
| 🔴 | Terms of Use — lawyer review and approval | `app/legal/terms/page.tsx` — template only |
| 🔴 | Refund Policy — lawyer review and approval | `app/legal/refund/page.tsx` — template only |
| 🔴 | Fill in all `[סמן כאן]` placeholders in legal pages | Business registration, retention periods, etc. |
| 🔴 | Register as a data controller (מאגר מידע) | Required under Israeli Privacy Protection Law if maintaining a database of customers |
| 🔴 | Verify B2B exemptions from Consumer Protection Law | Your lawyer must confirm which regulations apply |
| 🔴 | Kashrut / allergen declarations must be accurate | Legal liability for food labeling errors |
| 🟡 | Cookie/LocalStorage notice — confirm with lawyer | Currently states no marketing cookies — must be accurate |

---

## ♿ Accessibility (WCAG 2.0 AA)

| Status | Item | Notes |
|--------|------|-------|
| 🟢 | Skip-to-content link | `app/layout.tsx` |
| 🟢 | Semantic HTML structure | All pages |
| 🟢 | Form labels and ARIA | `app/checkout/page.tsx` |
| 🟢 | Visible focus states | `globals.css` + Tailwind `focus-visible:ring-*` |
| 🟢 | Error announcements (role="alert") | Checkout form |
| 🟢 | RTL language declaration | `lang="he" dir="rtl"` on `<html>` |
| 🟢 | Accessibility statement page | `/legal/accessibility` |
| 🔴 | Full audit by certified מורשה נגישות | Required by Israeli law before launch |
| 🔴 | Test with NVDA or VoiceOver screen reader | Not yet tested |
| 🔴 | Appoint accessibility coordinator (גורם אחראי לנגישות) | Fill in accessibility page |
| 🟡 | Add `prefers-reduced-motion` support | For users sensitive to animations |
| 🟡 | Color contrast audit with automated tool | Use axe DevTools or Lighthouse |
| 🟡 | Keyboard navigation testing across all pages | Manual testing required |

---

## 🎨 Content & Brand

| Status | Item | Notes |
|--------|------|-------|
| 🔴 | Update business name throughout site | Currently "שבת פוד" — confirm final name |
| 🔴 | Add real phone number | Footer, checkout header |
| 🔴 | Add real email address | Footer, legal pages |
| 🔴 | Add real physical address (if needed) | Legal pages |
| 🔴 | Add business registration number (ח.פ/ע.מ) | Required in legal pages |
| 🔴 | Set all menu prices | Currently shown as "??" |
| 🔴 | Review and approve all menu descriptions | Make sure they're accurate |
| 🟡 | Add real food photos | Replace Unsplash placeholders with actual product photos |
| 🟡 | Add OG image for social sharing | `app/layout.tsx` metadata |
| 🟡 | Verify delivery zone and slots are accurate | Currently placeholders |

---

## 💳 Payment

| Status | Item | Notes |
|--------|------|-------|
| 🔴 | Register with payment provider (Grow/Meshulam/Cardcom) | Requires business documents |
| 🔴 | Integrate payment gateway | Connect to `/api/checkout` |
| 🔴 | Test payment flow end-to-end (with test card) | Before going live |
| 🔴 | Verify payment confirmation webhook | Make sure orders are marked as paid |
| 🟡 | PCI-DSS compliance check | Your payment provider handles most of this; verify scope |

---

## 🚀 Deployment

| Status | Item | Notes |
|--------|------|-------|
| 🔴 | Connect custom domain | `shabbatfood.co.il` (or your actual domain) |
| 🔴 | Set environment variables on Vercel | Settings → Environment Variables |
| 🔴 | Run `npm run build` locally — zero errors | Fix any TypeScript/lint errors |
| 🔴 | Set `NEXT_PUBLIC_BASE_URL` to production URL | Email links and OG tags |
| 🟡 | Set up error monitoring | Sentry free tier recommended |
| 🟡 | Set up uptime monitoring | Better Uptime / UptimeRobot (free) |
| 🟡 | Configure Vercel Analytics | Built-in, privacy-friendly |
| 🟡 | Set up backup for order data | If using file-based orders, back up regularly |

---

## 🧪 Testing Before Launch

| Status | Item | Notes |
|--------|------|-------|
| 🔴 | Place a complete test order | Verify all fields, email receipt, and order logging |
| 🔴 | Test on mobile (iOS Safari + Android Chrome) | Responsive + form usability |
| 🔴 | Test keyboard-only navigation | Tab through entire checkout |
| 🔴 | Test with invalid inputs | SQL injection strings, XSS strings, oversized payloads |
| 🔴 | Run Lighthouse audit | Aim for Performance >90, Accessibility >90 |
| 🟡 | Test with slow network (3G throttle in DevTools) | Loading experience |
| 🟡 | Cross-browser test (Firefox, Safari, Edge) | |

---

*Generated by production hardening pass — שבת פוד, April 2026.*
*Update this checklist as items are completed.*
