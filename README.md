# Aexon web

Marketing site for **Aexon Healthcare Limited**: dry laser film imagers designed and built in Middlesbrough, sold to hospitals, clinics and distributors in the UK and Bangladesh.

Built with Next.js (App Router) and plain CSS (global tokens plus CSS Modules). There is no CSS framework.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
|---|---|
| `content/site.ts` | **All copy and product facts.** Edit this first. |
| `app/page.tsx` | Landing page |
| `app/products/[slug]/page.tsx` | Product detail pages with the 3D viewer |
| `components/Product3D.tsx` | Drag, swipe or arrow keys to turn the product. Hotspots float on their own depth layer. |
| `components/TiltCard.tsx` | Feature cards that tilt toward the pointer |
| `components/TaglineReveal.tsx` | Large tagline that lights up word by word on scroll |
| `components/QuoteForm.tsx` | Quote form with client-side validation |
| `app/api/quote/route.ts` | Receives form submissions |
| `app/globals.css` | Design tokens: spacing, radius, colour, named text styles, motion curve |

## Before launch

1. **Connect the quote form.** Set `QUOTE_WEBHOOK_URL` to a Zapier, Make, Slack or CRM webhook. Each request is POSTed there as JSON. Until it is set, requests only go to the server log.
2. **Sales email.** Replace `{{sales_email}}` in `content/site.ts`. The footer hides it until you do.
3. **Testimonials.** Replace the `{{…}}` entries in `testimonials`. They show in `npm run dev` and stay hidden in production builds until they are real.
4. **Specs.** Product spec rows with `value: null` show "Available on request". Fill in resolution (Laser Prime), film sizes, throughput, connectivity, dimensions and weight.
5. **Hotspot positions.** Check the `x`/`y` percentages in `content/site.ts` against the photos.
6. **Legal pages.** `/privacy` and `/terms` describe what the site actually does. Have them reviewed.
7. **Cookies.** The site sets no tracking cookies. If you add analytics, add a consent banner too (UK GDPR / PECR).
8. **Social links.** LinkedIn, YouTube and X were left out because the URLs were unknown. Add them to `Footer.tsx`.

## Page plan

**Primary action:** Request a quote. The single form serves hospitals and distributors through an "I am a" field, so one CTA covers both audiences.

**Layout:** A, classic hero plus sections. The product is easy to understand from a photo, and visitors from search usually already know they need a film imager.

**Landing page order:** hero → wet vs dry processing → benefits → products → tagline reveal → how it works → proof → FAQ → quote form with risk reversal.

**SEO:** indexed. It has a title, meta description, Open Graph image (`public/og.jpg`), canonical URLs, `sitemap.xml`, `robots.txt`, Organization, Product and FAQPage JSON-LD.

## Design rules followed

- Geist only, no italics, weights capped at semibold
- Every font size is a named text style (`heading-1`, `body-6`, `caption-4` …) on the Tailwind type scale
- Spacing only from the token list (2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px)
- Nested radii follow *inner = outer − gap*
- Flat dark backgrounds. The hero heading is the only gradient, and it is applied to text.
- Phosphor icons
- One motion curve, `cubic-bezier(0.22, 1, 0.36, 1)`. Only transform and opacity are animated, and `prefers-reduced-motion` is respected.
- Checked at 390 px with no horizontal overflow
