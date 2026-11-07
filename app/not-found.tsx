import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { products } from "@/content/site";
import styles from "@/components/Legal.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.body}>
          <p className="caption-1 eyebrow">Error 404</p>
          <h1 className="heading-2 gradient-text">This page is not on file</h1>
          <p className="body-3 muted">
            The link may be old or mistyped. Try one of these instead.
          </p>
          <ul className="body-3">
            <li><Link href="/">Home</Link></li>
            {products.map((p) => (
              <li key={p.slug}><Link href={`/products/${p.slug}`}>{p.name}</Link></li>
            ))}
            <li><Link href="/#quote">Request a quote</Link></li>
          </ul>
          <div>
            <Link href="/" className="btn btn-primary button-md">
              <ArrowLeft size={16} weight="bold" aria-hidden /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
