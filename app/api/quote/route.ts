import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROLES = ["Hospital or clinic", "Distributor or reseller", "Other"];
const COUNTRIES = ["United Kingdom", "Bangladesh", "Other"];

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Receives quote requests from the site form.
 *
 * Delivery: set QUOTE_WEBHOOK_URL to forward each request as JSON
 * (Zapier, Make, Slack, a CRM inbox, or an email service). Without it,
 * requests are only written to the server log.
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

  const data = {
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
  if (!data.name) errors.name = "Name is required.";
  if (!data.organisation) errors.organisation = "Organisation is required.";
  if (!EMAIL_RE.test(data.email)) errors.email = "A valid email is required.";
  if (!ROLES.includes(data.role)) errors.role = "Role is required.";
  if (!COUNTRIES.includes(data.country)) errors.country = "Country is required.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });
  }

  const hook = process.env.QUOTE_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[quote] delivery failed", err);
      return NextResponse.json({ error: "Could not deliver request." }, { status: 502 });
    }
  } else {
    console.info("[quote] new request (set QUOTE_WEBHOOK_URL to forward these)", data);
  }

  return NextResponse.json({ ok: true });
}
