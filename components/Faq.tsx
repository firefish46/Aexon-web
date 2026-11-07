import { faqs } from "@/content/site";
import styles from "./Faq.module.css";

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className={styles.list}>
      {faqs.map((f) => (
        <details key={f.q} className={styles.item}>
          <summary className={`title-2 ${styles.q}`}>
            {f.q}
            <span className={styles.icon} aria-hidden />
          </summary>
          <p className={`body-3 muted ${styles.a}`}>{f.a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
