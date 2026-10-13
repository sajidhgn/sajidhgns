import nodemailer from "nodemailer";
import { z } from "zod";
import { site } from "../../../content/site";

/**
 * POST /api/send-email — contact form endpoint.
 *
 * Request:  Content-Type: application/json
 *           { name, email, message, subject?, company?, locale?, website? }   (`website` is a honeypot: leave it empty)
 *           subject: optional, trimmed, ≤ 120 characters, no control characters (so no line breaks) — used in the
 *           email's subject line and body. An empty string means "no subject".
 * Response: { success: true }
 *           { success: false, code } with code one of
 *             400 invalid_json · 413 payload_too_large · 415 unsupported_media_type
 *             422 validation_error (+ fields: { name|email|subject|company|message: "required"|"too_short"|"too_long"|"invalid" })
 *             429 rate_limited (+ Retry-After header, seconds) · 502 send_failed · 503 not_configured
 *
 * The contact form (client/sections/ContactForm/schema.js) mirrors these validation rules — keep them in sync.
 *
 * Configuration (see .env.example): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO.
 * Message bodies are never logged.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const hasNoControlChars = (value) => !/[\u0000-\u001f\u007f]/.test(value);

const contactSchema = z.object({
  name: z
    .string({ required_error: "required" })
    .trim()
    .min(1, "required")
    .max(80, "too_long")
    .refine(hasNoControlChars, "invalid"),
  email: z
    .string({ required_error: "required" })
    .trim()
    .min(1, "required")
    .max(254, "too_long")
    .email("invalid"),
  subject: z.string().trim().max(120, "too_long").refine(hasNoControlChars, "invalid").nullish(),
  company: z.string().trim().max(120, "too_long").refine(hasNoControlChars, "invalid").nullish(),
  message: z
    .string({ required_error: "required" })
    .trim()
    .min(1, "required")
    .min(10, "too_short")
    .max(4000, "too_long"),
  locale: z.enum(["en", "ar"]).nullish(),
});

const FIELD_ERROR_CODES = new Set(["required", "too_short", "too_long", "invalid"]);

function fieldErrors(error) {
  const fields = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string" || fields[field]) continue;
    fields[field] = FIELD_ERROR_CODES.has(issue.message) ? issue.message : "invalid";
  }
  return fields;
}

function json(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function getMailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const parsedPort = Number.parseInt(process.env.SMTP_PORT ?? "", 10);
  const port = parsedPort > 0 && parsedPort < 65536 ? parsedPort : 587;
  const to = process.env.CONTACT_TO?.trim() || site.email;
  return { host, port, user, pass, to };
}

/* ---------------------------------------------------------------- rate limiting */

// Tiny in-memory limiter: per server instance, resets on cold start. Good enough to stop
// casual abuse; not a substitute for a shared store.
const hits = new Map();

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Records a hit; returns 0 when allowed, otherwise the seconds until the next allowed hit. */
function rateLimit(ip, now = Date.now()) {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((time) => time > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return Math.max(1, Math.ceil((recent[0] + RATE_LIMIT_WINDOW_MS - now) / 1000));
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times[times.length - 1] <= windowStart) hits.delete(key);
    }
  }
  return 0;
}

/* ---------------------------------------------------------------------- email */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Subject line: "Portfolio enquiry from Ada: Design role" (name ≤ 80 + subject ≤ 120, both control-char free). */
function buildSubject({ name, subject }) {
  return subject ? `Portfolio enquiry from ${name}: ${subject}` : `Portfolio enquiry from ${name}`;
}

function buildEmail({ name, email, subject, company, message, locale }) {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Subject", subject || "—"],
    ["Company", company || "—"],
    ["Site language", locale || "—"],
  ];

  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${message}\n`;

  const html = `<!doctype html>
<html><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">
<table role="presentation" cellpadding="4" cellspacing="0">${rows
    .map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("")}</table>
<hr>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
</body></html>`;

  return { text, html };
}

/* ---------------------------------------------------------------------- route */

export async function POST(request) {
  const config = getMailConfig();
  if (!config) {
    return json({ success: false, code: "not_configured" }, 503);
  }

  const retryAfter = rateLimit(clientIp(request));
  if (retryAfter) {
    return json({ success: false, code: "rate_limited" }, 429, { "Retry-After": String(retryAfter) });
  }

  // Requiring JSON keeps cross-site browser posts behind a CORS preflight.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ success: false, code: "unsupported_media_type" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ success: false, code: "payload_too_large" }, 413);
  }

  let body;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return json({ success: false, code: "payload_too_large" }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return json({ success: false, code: "invalid_json" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ success: false, code: "invalid_json" }, 400);
  }

  // Honeypot: humans never see the "website" field. Pretend success so bots learn nothing.
  if (typeof body.website === "string" ? body.website.trim() !== "" : body.website != null) {
    return json({ success: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ success: false, code: "validation_error", fields: fieldErrors(parsed.error) }, 422);
  }

  const { name, email } = parsed.data;
  const { text, html } = buildEmail(parsed.data);

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      requireTLS: config.port === 587,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    await transporter.sendMail({
      from: { name: "Portfolio contact form", address: config.user },
      to: config.to,
      replyTo: { name, address: email },
      subject: buildSubject(parsed.data),
      text,
      html,
    });

    return json({ success: true });
  } catch (error) {
    // Log only transport metadata — never the visitor's message or details.
    console.error("[contact] send failed", {
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
    });
    return json({ success: false, code: "send_failed" }, 502);
  }
}
