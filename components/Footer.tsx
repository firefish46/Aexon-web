import Logo from "./Logo";
import Link from "next/link";
import { isPlaceholder, products, site } from "@/content/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const showEmail = !isPlaceholder(site.email);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p className="body-6 muted">
            Dry laser film imagers, designed and manufactured in the UK for modern healthcare facilities.
          </p>
        </div>

        <div>
          <h2 className="title-4">Products</h2>
          <ul className={styles.list}>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="body-6">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="title-4">Company</h2>
          <ul className={styles.list}>
            <li><Link href="/#how-it-works" className="body-6">How it works</Link></li>
            <li><Link href="/#faq" className="body-6">FAQ</Link></li>
            <li><Link href="/#quote" className="body-6">Request a quote</Link></li>
          </ul>
        </div>

        <address className={styles.contact}>
          <h2 className="title-4">Contact</h2>
          <p className="body-6 muted">
            {site.legalName}
            <br />
            {site.address.line1}, {site.address.city}
            <br />
            {site.address.postcode}, {site.address.country}
          </p>
          <a href={site.phoneHref} className="body-6">{site.phone}</a>
          {showEmail && (
            <a href={`mailto:${site.email}`} className="body-6">{site.email}</a>
          )}
        </address>
      </div>

      <div className={`container ${styles.legal}`}>
        <p className="caption-5 muted">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
        <ul className={styles.legalLinks}>
          <li><Link href="/privacy" className="caption-5">Privacy policy</Link></li>
          <li><Link href="/terms" className="caption-5">Terms of use</Link></li>
        </ul>
      </div>
    </footer>
  );
}
