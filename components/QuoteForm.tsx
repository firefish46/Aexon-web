"use client";

import { useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { products, site } from "@/content/site";
import styles from "./QuoteForm.module.css";

type Fields = {
  name: string;
  organisation: string;
  email: string;
  role: string;
  country: string;
  product: string;
  message: string;
  company_url: string; // honeypot
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Enter your full name.";
  if (!f.organisation.trim()) e.organisation = "Enter your hospital, clinic or company.";
  if (!f.email.trim()) e.email = "Enter your work email.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter an email in the format name@company.com.";
  if (!f.role) e.role = "Choose the option that describes you.";
  if (!f.country) e.country = "Choose your country.";
  return e;
}

export default function QuoteForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const [fields, setFields] = useState<Fields>({
    name: "",
    organisation: "",
    email: "",
    role: "",
    country: "",
    product: defaultProduct,
    message: "",
    company_url: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const set = (k: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [k]: ev.target.value };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    setTouched({ name: true, organisation: true, email: true, role: true, country: true });
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`q-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className={`card ${styles.done}`} role="status">
        <CheckCircle size={32} weight="duotone" className={styles.okIcon} aria-hidden />
        <h3 className="heading-5">Request sent</h3>
        <p className="body-3 muted">
          Thanks, {fields.name.split(" ")[0]}. Your request is with our sales team and we will reply to{" "}
          {fields.email} within 24 hours.
        </p>
      </div>
    );
  }

  const err = (k: keyof Fields) =>
    errors[k] && touched[k] ? (
      <p id={`q-${k}-err`} className={`caption-2 ${styles.error}`}>
        <WarningCircle size={16} aria-hidden /> {errors[k]}
      </p>
    ) : null;

  const aria = (k: keyof Fields) => ({
    id: `q-${k}`,
    name: k,
    "aria-invalid": Boolean(errors[k] && touched[k]),
    "aria-describedby": errors[k] && touched[k] ? `q-${k}-err` : undefined,
    onBlur: blur(k),
    onChange: set(k),
    value: fields[k],
  });

  return (
    <form className={`card ${styles.form}`} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="q-name" className="title-4">Full name</label>
          <input type="text" autoComplete="name" required {...aria("name")} />
          {err("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="q-organisation" className="title-4">Organisation</label>
          <input type="text" autoComplete="organization" required {...aria("organisation")} />
          {err("organisation")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="q-email" className="title-4">Work email</label>
        <input type="email" autoComplete="email" inputMode="email" required {...aria("email")} />
        {err("email")}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="q-role" className="title-4">I am a</label>
          <select required {...aria("role")}>
            <option value="" disabled>Choose one</option>
            <option>Hospital or clinic</option>
            <option>Distributor or reseller</option>
            <option>Other</option>
          </select>
          {err("role")}
        </div>
        <div className={styles.field}>
          <label htmlFor="q-country" className="title-4">Country</label>
          <select required {...aria("country")}>
            <option value="" disabled>Choose one</option>
            <option>United Kingdom</option>
            <option>Bangladesh</option>
            <option>Other</option>
          </select>
          {err("country")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="q-product" className="title-4">Product</label>
        <select {...aria("product")}>
          <option value="">Not sure yet</option>
          {products.map((p) => (
            <option key={p.slug} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="q-message" className="title-4">
          Anything else? <span className="caption-5 muted">Optional</span>
        </label>
        <textarea rows={4} placeholder="Expected monthly film volume, number of sites, timeline" {...aria("message")} />
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div className={styles.hp} aria-hidden>
        <label htmlFor="q-company_url">Leave this empty</label>
        <input type="text" tabIndex={-1} autoComplete="off" {...aria("company_url")} />
      </div>

      {status === "failed" && (
        <p className={`body-6 ${styles.error} ${styles.banner}`} role="alert">
          <WarningCircle size={16} aria-hidden /> We could not send your request. Try again, or call us on{" "}
          <a href={site.phoneHref}>{site.phone}</a>.
        </p>
      )}

      <div className={styles.submit}>
        <button type="submit" className="btn btn-primary btn-lg button-md" disabled={status === "sending"}>
          {status === "sending" ? "Sending request" : "Request a quote"}
        </button>
        <p className="caption-5 muted">No obligation. {site.replyPromise}</p>
      </div>
    </form>
  );
}
