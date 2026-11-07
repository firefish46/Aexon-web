"use client";

import { useEffect, useRef } from "react";

type Props = {
  as?: "div" | "section" | "li" | "article";
  className?: string;
  children: React.ReactNode;
  id?: string;
  delay?: number;
} & React.HTMLAttributes<HTMLElement>;

/** Rises 32px and fades in once when it enters the viewport. */
export default function Reveal({ as = "div", className = "", children, delay = 0, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
