import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import Product3D from "@/components/Product3D";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";
import QuoteForm from "@/components/QuoteForm";
import ChipShowcase from "@/components/ChipShowcase";
import ConsoleTour from "@/components/ConsoleTour";
import { getProduct, products, site } from "@/content/site";
import styles from "./product.module.css";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${p.name}, ${p.type.toLowerCase()}`;
  return {
    title,
    description: `${p.summary} Designed and built in the UK by Aexon Healthcare.`,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: `${title} | Aexon Healthcare`,
      description: p.summary,
      images: [{ url: p.image, width: p.imageWidth, height: p.imageHeight, alt: p.alt }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const other = products.find((p) => p.slug !== product.slug)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: `${site.url}${product.image}`,
    brand: { "@type": "Brand", name: "Aexon" },
    manufacturer: { "@type": "Organization", name: site.legalName },
  };

  const back = (
    <Link href="/#products" className={`link-arrow button-sm ${styles.back}`}>
      <ArrowLeft size={16} weight="bold" aria-hidden /> All products
    </Link>
  );

  const title = (
    <>
      <p className="caption-1 eyebrow">{product.type}</p>
      <h1 id="product-title" className="heading-2 gradient-text">{product.name}</h1>
    </>
  );

  // withTitle: false when the title is shown above the model instead
  const info = (withTitle: boolean) => (
    <div className={styles.info}>
      {withTitle && title}
      <p className="title-2">{product.tagline}</p>
      <p className="body-3 muted">{product.summary}</p>

      <ul className={styles.quick}>
        {product.highlights.map((h) => (
          <li key={h.title} className="body-5">
            <Check size={16} weight="bold" aria-hidden /> {h.title}
          </li>
        ))}
      </ul>

      <a href="#quote" className="btn btn-primary btn-lg button-md">
        Request a quote <ArrowRight size={16} weight="bold" aria-hidden />
      </a>
      <p className="caption-5 muted">No obligation. {site.replyPromise}</p>
    </div>
  );

  return (
    <>
      {product.model ? (
        // Product name above a full screen model, the rest of the copy centred underneath
        <section className={`${styles.hero} ${styles.heroFull}`} aria-labelledby="product-title">
          <div className={`container ${styles.backRow}`}>{back}</div>
          <div className={`container ${styles.titleCenter}`}>{title}</div>
          <Product3D product={product} />
          <div className={`container ${styles.infoCenter}`}>{info(false)}</div>
        </section>
      ) : (
        <section className={styles.hero} aria-labelledby="product-title">
          <div className="container">
            {back}
            <div className={styles.heroGrid}>
              <Product3D product={product} />
              {info(true)}
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="features-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="caption-1 eyebrow">Features</p>
            <h2 id="features-title" className="heading-3">Built around how film is printed every day</h2>
          </Reveal>
          <ul className="grid-4">
            {product.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 80}>
                <TiltCard>
                  <span className={`caption-3 ${styles.featNum}`}>0{i + 1}</span>
                  <h3 className="title-2">{h.title}</h3>
                  <p className="body-6 muted">{h.body}</p>
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {product.chip && <ChipShowcase chip={product.chip} productName={product.name} />}
      {product.console && <ConsoleTour tour={product.console} />}

      <section className="section" aria-labelledby="specs-title">
        <div className={`container ${styles.specWrap}`}>
          <Reveal className={`section-head ${styles.centerHead}`}>
            <p className="caption-1 eyebrow">Specifications</p>
            <h2 id="specs-title" className="heading-3">{product.name} at a glance</h2>
            <p className="body-3 muted">
              The full specification sheet comes with every quote. Ask for it in the form below.
            </p>
          </Reveal>
          <Reveal>
            <dl className={`card ${styles.specs}`}>
              {product.specs.map((s) => (
                <div key={s.label} className={styles.specRow}>
                  <dt className="body-5 muted">{s.label}</dt>
                  <dd className={s.value ? "body-4" : "body-6 muted"}>{s.value ?? "Available on request"}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="other-title">
        <div className="container">
          <Reveal>
            <Link href={`/products/${other.slug}`} className={`card ${styles.other}`}>
              <div className={styles.otherImg}>
                <Image src={other.image} alt={other.alt} width={other.imageWidth} height={other.imageHeight} sizes="200px" />
              </div>
              <div className={styles.otherBody}>
                <p className="caption-4 muted">Also from Aexon</p>
                <h2 id="other-title" className="heading-5">{other.name}</h2>
                <p className="body-6 muted">{other.tagline}</p>
                <span className="link-arrow button-sm">
                  Explore in 3D <ArrowRight size={16} weight="bold" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section" id="quote" aria-labelledby="quote-title">
        <div className={`container ${styles.quoteWrap}`}>
          <Reveal className={`${styles.quoteCopy} ${styles.centerHead}`}>
            <p className="caption-1 eyebrow">Request a quote</p>
            <h2 id="quote-title" className="heading-3">Get pricing for the {product.name.replace("Aexon ", "")}</h2>
            <p className="body-3 muted">
              We will reply within 24 hours with pricing and the full specification sheet. Distributors, tell us
              which territory you cover.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <QuoteForm defaultProduct={product.name} />
          </Reveal>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
