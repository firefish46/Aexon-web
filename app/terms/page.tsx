import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import styles from "@/components/Legal.module.css";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using the Aexon Healthcare Limited website.",
  alternates: { canonical: "/terms" },
};

// Review this page with your legal adviser before launch.
export default function Terms() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.body}>
          <p className="caption-1 eyebrow">Legal</p>
          <h1 className="heading-3">Terms of use</h1>
          <p className="body-3 muted">
            This website is operated by {site.legalName}, {site.address.line1}, {site.address.city}{" "}
            {site.address.postcode}, {site.address.country}. By using it you accept these terms.
          </p>

          <h2 className="heading-6">Product information</h2>
          <p className="body-3 muted">
            Product descriptions and images on this site are for general information. Specifications, pricing and
            availability are confirmed in writing in your quote and may change without notice.
          </p>

          <h2 className="heading-6">No medical advice</h2>
          <p className="body-3 muted">
            Nothing on this website is medical advice. Equipment should be installed and used by trained staff
            following the instructions supplied with it.
          </p>

          <h2 className="heading-6">Content</h2>
          <p className="body-3 muted">
            The Aexon name, logo, product photography and text on this site belong to {site.legalName}. Please ask
            before reusing them.
          </p>

          <h2 className="heading-6">Governing law</h2>
          <p className="body-3 muted">These terms are governed by the law of England and Wales.</p>

          <p className="body-6 muted">
            <Link href="/">Back to home</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
