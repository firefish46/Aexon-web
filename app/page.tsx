import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChatText,
  Check,
  Clock,
  DropSlash,
  Factory,
  Plugs,
  Handshake,
  MagnifyingGlass,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import TaglineReveal from "@/components/TaglineReveal";
import QuoteForm from "@/components/QuoteForm";
import Faq from "@/components/Faq";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import { isPlaceholder, products, site, testimonials } from "@/content/site";
import styles from "./page.module.css";

const benefits = [
  {
    icon: DropSlash,
    title: "No chemicals, no darkroom",
    body: "Dry laser imaging means no developer or fixer to buy, store or dispose of.",
  },
  {
    icon: MagnifyingGlass,
    title: "Detail clinicians can read",
    body: "Both imagers print at 508 DPI with 14 bit greyscale for crisp lines and smooth tones.",
  },
  {
    icon: Plugs,
    title: "Plugs into your PACS",
    body: "Standard DICOM 3.0 over Ethernet, with automatic calibration from a built in densitometer.",
  },
  {
    icon: Factory,
    title: "Straight from the manufacturer",
    body: "Pricing and support come from the team that designs and builds the imagers in the UK.",
  },
];

const steps = [
  {
    icon: ChatText,
    title: "Tell us what you need",
    body: "Send a short request with your site or territory, the product you are looking at and your expected film volume.",
  },
  {
    icon: Clock,
    title: "Get your quote within 24 hours",
    body: "Our sales team replies with pricing, the full specification sheet and answers to your questions.",
  },
  {
    icon: Truck,
    title: "Supply through the right partner",
    body: "We supply you directly or through an authorised Aexon distributor in your region.",
  },
];

const slides: Slide[] = [
  {
    eyebrow: "Dry laser film imagers",
    title: "Two imagers, one standard of film",
    body: "Laser Prime for busy imaging departments, Laser Pro for clinics and smaller rooms. Both print 508 DPI with 14 bit greyscale.",
    href: "#products",
    cta: "Compare the imagers",
    visual: "duo",
  },
  {
    eyebrow: "Aexon Laser Prime",
    title: "130 sheets an hour for busy departments",
    body: "A floor standing dry laser imager with two 150 sheet trays, gigabit DICOM networking and automatic calibration.",
    href: "/products/laser-prime",
    cta: "Explore the Laser Prime",
    visual: "prime",
  },
  {
    eyebrow: "Aexon Laser Pro",
    title: "508 DPI film in normal room light",
    body: "A compact direct dry imager that prints 75 sheets an hour and connects to your PACS over DICOM 3.0.",
    href: "/products/laser-pro",
    cta: "Explore the Laser Pro",
    visual: "pro",
  },
  {
    eyebrow: "Inside the Laser Pro",
    title: "One controller runs every print",
    body: "A DASCOM DS1301 controller sits at the centre of the main board. Every image you send passes through it on the way to film.",
    href: "/products/laser-pro#inside",
    cta: "See how it works",
    visual: "chip",
  },
  {
    eyebrow: "Touchscreen console",
    title: "Everything you need, on the printer",
    body: "Printer status, tray status and the print queue on one screen, with settings and maintenance a tap away.",
    href: "/products/laser-pro#console",
    cta: "Take the console tour",
    visual: "console",
  },
];

const facts = [
  { value: "UK", label: "Designed and manufactured in Middlesbrough" },
  { value: "508 DPI", label: "Print resolution on both imagers, with 14 bit greyscale" },
  { value: "24 hours", label: "Reply time on every quote request" },
  { value: "130+", label: "Sheets per hour of 14×17 in film on the Laser Prime" },
];

export default function Home() {
  const showTestimonials = process.env.NODE_ENV !== "production" || !testimonials.some((t) => isPlaceholder(t.quote));
  const prime = products[0];
  const pro = products[1];

  return (
    <>
      {/* 1. Hero: full width slider, then the headline and quote button */}
      <HeroSlider slides={slides} prime={prime} pro={pro} chipImage={pro.chip?.image ?? pro.image} />

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className="container">
          <div className={styles.heroCopy}>
            <p className="caption-1 eyebrow">Dry laser film imagers for hospitals and distributors</p>
            <h1 id="hero-title" className="heading-1 gradient-text">
              Clear film, printed dry.
              <br />
              Designed in the UK.
            </h1>
            <p className={`body-3 muted ${styles.sub}`}>
              Aexon designs and builds diagnostic film imagers in Middlesbrough and supplies hospitals,
              clinics and distributors across the UK and Bangladesh.
            </p>
            <a href="#quote" className="btn btn-primary btn-lg button-md">
              Request a quote <ArrowRight size={16} weight="bold" aria-hidden />
            </a>
            <ul className={styles.proof}>
              <li className="caption-4 muted"><Check size={14} weight="bold" aria-hidden /> 508 DPI, 14 bit greyscale</li>
              <li className="caption-4 muted"><Check size={14} weight="bold" aria-hidden /> Reply within 24 hours</li>
              <li className="caption-4 muted"><Check size={14} weight="bold" aria-hidden /> UK manufacturer</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Problem to solution */}
      <section className="section" aria-labelledby="problem-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="caption-1 eyebrow">Why dry imaging</p>
            <h2 id="problem-title" className="heading-3">
              Wet film processing keeps your department tied to chemicals
            </h2>
          </Reveal>
          <div className="grid-2">
            <Reveal className={`card ${styles.compare}`}>
              <p className="caption-3 muted">Wet processing</p>
              <ul className={styles.compareList}>
                <li className="body-3">Developer and fixer to order, store and dispose of</li>
                <li className="body-3">A darkroom that takes up space and needs ventilation</li>
                <li className="body-3">Processors that need cleaning and replenishing</li>
              </ul>
            </Reveal>
            <Reveal className={`card ${styles.compare} ${styles.compareGood}`} delay={100}>
              <p className="caption-3">Aexon dry laser imaging</p>
              <ul className={styles.compareList}>
                <li className="body-3">Prints straight to film with heat and a laser</li>
                <li className="body-3">No darkroom and no processor to clean or replenish</li>
                <li className="body-3">Self calibrating, so film stays consistent sheet after sheet</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Benefits */}
      <section className="section" aria-labelledby="benefits-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="caption-1 eyebrow">Benefits</p>
            <h2 id="benefits-title" className="heading-3">What changes when you switch to Aexon</h2>
          </Reveal>
          <ul className="grid-4">
            {benefits.map((b, i) => (
              <Reveal as="li" key={b.title} className={`card ${styles.benefit}`} delay={i * 80}>
                <span className={styles.iconBox}><b.icon size={24} weight="duotone" aria-hidden /></span>
                <h3 className="title-2">{b.title}</h3>
                <p className="body-6 muted">{b.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Products */}
      <section className="section" id="products" aria-labelledby="products-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="caption-1 eyebrow">Products</p>
            <h2 id="products-title" className="heading-3">Two imagers for every size of department</h2>
          </Reveal>
          <div className="grid-2">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <Link href={`/products/${p.slug}`} className={`card ${styles.product}`}>
                  <div className={styles.productImg}>
                    <Image src={p.image} alt={p.alt} width={p.imageWidth} height={p.imageHeight} sizes="(max-width: 720px) 70vw, 280px" />
                  </div>
                  <div className={styles.productBody}>
                    <p className="caption-4 muted">{p.type}</p>
                    <h3 className="heading-5">{p.name}</h3>
                    <p className="body-6 muted">{p.tagline}</p>
                    <span className="link-arrow button-sm">
                      Explore in 3D <ArrowRight size={16} weight="bold" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Tagline reveal */}
      <TaglineReveal
        lines={[
          "Sharp film, printed dry,",
          "from a UK manufacturer",
          "that answers the phone.",
        ]}
      />

      {/* 6. How it works */}
      <section className="section" id="how-it-works" aria-labelledby="how-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="caption-1 eyebrow">How it works</p>
            <h2 id="how-title" className="heading-3">From first message to film on the ward</h2>
          </Reveal>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} className={`card ${styles.step}`} delay={i * 100}>
                <span className={`caption-3 ${styles.stepNum}`}>Step {i + 1}</span>
                <s.icon size={24} weight="duotone" aria-hidden className={styles.stepIcon} />
                <h3 className="title-2">{s.title}</h3>
                <p className="body-6 muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Proof */}
      <section className="section" aria-labelledby="proof-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="caption-1 eyebrow">Why partners choose Aexon</p>
            <h2 id="proof-title" className="heading-3">A manufacturer you can reach</h2>
          </Reveal>
          <dl className={styles.facts}>
            {facts.map((f, i) => (
              <Reveal key={f.label} className={styles.fact} delay={i * 80}>
                <dt className="heading-4">{f.value}</dt>
                <dd className="body-6 muted">{f.label}</dd>
              </Reveal>
            ))}
          </dl>

          {showTestimonials && (
            <div className={`grid-2 ${styles.quotes}`}>
              {testimonials.map((t, i) => (
                <Reveal as="article" key={i} className={`card ${styles.quote}`}>
                  <blockquote className="title-2">{t.quote}</blockquote>
                  <p className="caption-1">
                    {t.name} <span className="muted">{t.role}</span>
                  </p>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className={`card ${styles.partner}`}>
            <Handshake size={32} weight="duotone" aria-hidden className={styles.stepIcon} />
            <div>
              <h3 className="title-2">Distributors and resellers</h3>
              <p className="body-6 muted">
                Covering hospitals in the UK or Bangladesh? Choose “Distributor or reseller” in the form below
                to talk about supplying Aexon imagers in your territory.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="section" id="faq" aria-labelledby="faq-title">
        <div className={`container ${styles.faqWrap}`}>
          <Reveal className={`section-head ${styles.centerHead}`}>
            <p className="caption-1 eyebrow">FAQ</p>
            <h2 id="faq-title" className="heading-3">Questions buyers ask us</h2>
            <p className="body-3 muted">
              Something else? Call us on <a href={site.phoneHref} className={styles.inlineLink}>{site.phone}</a>.
            </p>
          </Reveal>
          <Faq />
        </div>
      </section>

      {/* 9. Final CTA with risk reversal */}
      <section className="section" id="quote" aria-labelledby="quote-title">
        <div className={`container ${styles.quoteWrap}`}>
          <Reveal className={styles.quoteCopy}>
            <p className="caption-1 eyebrow">Request a quote</p>
            <h2 id="quote-title" className="heading-3">Get pricing for your hospital or territory</h2>
            <p className="body-3 muted">
              Tell us where you are and what you need. We will reply with pricing and the full specification sheet.
            </p>
            <ul className={styles.assurances}>
              <li className="body-5"><Check size={16} weight="bold" aria-hidden /> No obligation quote</li>
              <li className="body-5"><Check size={16} weight="bold" aria-hidden /> Reply within 24 hours</li>
              <li className="body-5"><Check size={16} weight="bold" aria-hidden /> Pricing for hospitals and distributors</li>
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
