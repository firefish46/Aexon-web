import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/content/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROLES = ["Hospital or clinic", "Distributor or reseller", "Other"];
const COUNTRIES = ["United Kingdom", "Bangladesh", "Other"];

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Quote = {
  name: string;
  organisation: string;
  email: string;
  role: string;
  country: string;
  product: string;
  message: string;
  receivedAt: string;
};

let transporter: Transporter | null = null;
function getTransport() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

async function sendEmail(q: Quote) {
  const t = getTransport();
  if (!t) return false;
  const to = process.env.QUOTE_TO || site.quoteInbox;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const rows: [string, string][] = [
    ["Name", q.name],
    ["Organisation", q.organisation],
    ["Email", q.email],
    ["I am a", q.role],
    ["Country", q.country],
    ["Product", q.product || "Not sure yet"],
    ["Message", q.message || "None"],
    ["Received", q.receivedAt],
  ];
  await t.sendMail({
    from: `Aexon website <${from}>`,
    to,
    replyTo: `${q.name} <${q.email}>`,
    subject: `Quote request: ${q.product || "Aexon imagers"} from ${q.organisation} (${q.country})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<h2 style="font-family:sans-serif">New quote request</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px;color:#666;vertical-align:top">${k}</td><td style="padding:6px 12px;white-space:pre-line">${esc(v)}</td></tr>`,
      )
      .join("")}</table>`,
  });
  return true;
}

async function sendWebhook(q: Quote) {
  const hook = process.env.QUOTE_WEBHOOK_URL;
  if (!hook) return false;
  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return true;
}

/**
 * Receives quote requests from the site form and emails them to the sales
 * inbox (cmo@dmebd.com by default) over SMTP. Optional: QUOTE_WEBHOOK_URL
 * also forwards each request as JSON. See .env.example.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (str(body.company_url)) return NextResponse.json({ ok: true });

  const q: Quote = {
    name: str(body.name, 120),
    organisation: str(body.organisation, 160),
    email: str(body.email, 200),
    role: str(body.role, 60),
    country: str(body.country, 60),
    product: str(body.product, 80),
    message: str(body.message, 2000),
    receivedAt: new Date().toISOString(),
  };

  const errors: Record<string, string> = {};
  if (!q.name) errors.name = "Name is required.";
  if (!q.organisation) errors.organisation = "Organisation is required.";
  if (!EMAIL_RE.test(q.email)) errors.email = "A valid email is required.";
  if (!ROLES.includes(q.role)) errors.role = "Role is required.";
  if (!COUNTRIES.includes(q.country)) errors.country = "Country is required.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });
  }

  try {
    const [mailed, hooked] = await Promise.all([sendEmail(q), sendWebhook(q)]);
    if (!mailed && !hooked) {
      if (process.env.NODE_ENV === "production") {
        console.error("[quote] no delivery configured: set SMTP_HOST in .env", q);
        return NextResponse.json({ error: "Delivery not configured." }, { status: 503 });
      }
      console.info("[quote] dev mode, not sent:", q);
    }
  } catch (err) {
    console.error("[quote] delivery failed", err, q);
    return NextResponse.json({ error: "Could not deliver request." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
