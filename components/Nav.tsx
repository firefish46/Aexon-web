"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import styles from "./Nav.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/products/laser-prime", label: "Laser Prime" },
  { href: "/products/laser-pro", label: "Laser Pro" },
  { href: "/#faq", label: "FAQ" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hasQuoteForm = pathname === "/" || pathname.startsWith("/products/");
  const quoteHref = hasQuoteForm ? "#quote" : "/#quote";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => !href.includes("#") && href === pathname;

  return (
    <>
      <header className={styles.wrap}>
        <nav className={styles.bar} aria-label="Main">
          <Link href="/" className={styles.logo} aria-label="Aexon Healthcare home">
            <Logo priority />
          </Link>

          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${styles.link} title-4`}
                  aria-current={isCurrent(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle className={styles.theme} />

          <a href={quoteHref} className={`btn btn-primary button-sm ${styles.cta}`}>
            Request a quote
          </a>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            data-open={open}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={styles.panel}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <ul className={styles.panelLinks}>
          {links.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${Math.min(i * 60, 400)}ms` : "0ms" }}>
              <Link
                href={l.href}
                className="heading-4"
                aria-current={isCurrent(l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li style={{ transitionDelay: open ? `${Math.min(links.length * 60, 400)}ms` : "0ms" }}>
            <a
              href={quoteHref}
              className="btn btn-primary btn-lg button-md"
              onClick={() => setOpen(false)}
            >
              Request a quote
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
