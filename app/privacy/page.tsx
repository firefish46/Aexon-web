import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import styles from "@/components/Legal.module.css";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Aexon Healthcare Limited collects and uses information sent through this website.",
  alternates: { canonical: "/privacy" },
};

// Review this page with your legal adviser before launch.
export default function Privacy() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.body}>
          <p className="caption-1 eyebrow">Legal</p>
          <h1 className="heading-3">Privacy policy</h1>
          <p className="body-3 muted">
            This policy explains what information {site.legalName} collects through this website and how we use it.
          </p>

          <h2 className="heading-6">What we collect</h2>
          <p className="body-3 muted">When you send a quote request we collect the details you enter:</p>
          <ul className="body-3 muted">
            <li>Your name, organisation and work email</li>
            <li>Whether you are a hospital, distributor or other buyer, and your country</li>
            <li>The product you are interested in and any message you add</li>
          </ul>

          <h2 className="heading-6">How we use it</h2>
          <p className="body-3 muted">
            We use these details only to reply to your request, prepare a quote and, where relevant, connect you
            with an authorised Aexon distributor in your region. We do not sell your information.
          </p>

          <h2 className="heading-6">Cookies</h2>
          <p className="body-3 muted">
            This website does not set advertising or analytics cookies. If that changes we will ask for your
            consent first.
          </p>

          <h2 className="heading-6">Your rights</h2>
          <p className="body-3 muted">
            Under UK data protection law you can ask to see, correct or delete the information we hold about you.
            Call us on <a href={site.phoneHref}>{site.phone}</a> or write to {site.legalName}, {site.address.line1},{" "}
            {site.address.city} {site.address.postcode}.
          </p>

          <p className="body-6 muted">
            <Link href="/">Back to home</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
