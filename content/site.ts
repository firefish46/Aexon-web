/**
 * All site copy and product facts live here.
 *
 * Rule: never invent facts. Anything we do not know yet is either
 * `null` (renders as "Available on request") or a `{{placeholder}}`
 * string (only shown in development, hidden in production builds).
 * Replace these with real values before launch.
 */

export const site = {
  name: "Aexon Healthcare",
  legalName: "Aexon Healthcare Limited",
  url: "https://aexon.uk",
  description:
    "Dry laser film imagers designed and built in the UK. Aexon supplies hospitals, clinics and authorised distributors across the UK and Bangladesh.",
  phone: "+44 7429 144950",
  phoneHref: "tel:+447429144950",
  // TODO: add the sales inbox, e.g. sales@aexon.uk
  email: "{{sales_email}}",
  address: {
    line1: "1 Peel Street",
    city: "Middlesbrough",
    postcode: "TS1 4DG",
    country: "United Kingdom",
  },
  replyPromise: "We reply within 24 hours.",
  regions: ["United Kingdom", "Bangladesh"],
};

export type Hotspot = {
  /** position on the product photo, in percent */
  x: number;
  y: number;
  title: string;
  body: string;
};

export type Product = {
  slug: string;
  name: string;
  type: string;
  tagline: string;
  summary: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  highlights: { title: string; body: string }[];
  hotspots: Hotspot[];
  specs: { label: string; value: string | null }[];
};

export const products: Product[] = [
  {
    slug: "laser-prime",
    name: "Aexon Laser Prime",
    type: "Advanced laser imaging system",
    tagline: "High definition film for busy imaging departments",
    summary:
      "A floor standing dry laser imager with two film trays, a touchscreen console and castors, built for departments that print film all day.",
    image: "/products/laser-prime.png",
    imageWidth: 783,
    imageHeight: 1068,
    alt: "Aexon Laser Prime dry laser imager, a white floor standing unit with a touchscreen and two blue film trays",
    highlights: [
      {
        title: "High definition imaging",
        body: "Fine detail on every sheet so clinicians read the film, not the noise.",
      },
      {
        title: "High speed printing",
        body: "Built for departments that queue film throughout the day.",
      },
      {
        title: "Dry laser process",
        body: "No developer, no fixer, no darkroom. Film comes out ready to read.",
      },
      {
        title: "Two film trays",
        body: "Two front loading trays keep film ready without stopping to reload.",
      },
    ],
    hotspots: [
      {
        x: 29,
        y: 8,
        title: "Film output",
        body: "Finished film exits at the top, dry and ready to read.",
      },
      {
        x: 57,
        y: 17,
        title: "Touchscreen console",
        body: "Status, queue and settings on one screen at standing height.",
      },
      {
        x: 37,
        y: 66,
        title: "Two film trays",
        body: "Front loading trays so staff reload without moving the unit.",
      },
      {
        x: 22,
        y: 94,
        title: "Castors",
        body: "Roll it into place and reposition it when the room changes.",
      },
    ],
    specs: [
      { label: "Imaging technology", value: "Dry laser" },
      { label: "Film trays", value: "2" },
      { label: "Controls", value: "Touchscreen" },
      { label: "Form factor", value: "Floor standing on castors" },
      { label: "Resolution", value: null },
      { label: "Film sizes", value: null },
      { label: "Throughput", value: null },
      { label: "Connectivity", value: null },
      { label: "Dimensions and weight", value: null },
    ],
  },
  {
    slug: "laser-pro",
    name: "Aexon Laser Pro",
    type: "Dry direct imager",
    tagline: "508 DPI film from a compact desktop unit",
    summary:
      "A compact dry direct imager with a 508 DPI print engine and a touchscreen, sized for clinics, wards and smaller imaging rooms.",
    image: "/products/laser-pro.png",
    imageWidth: 712,
    imageHeight: 731,
    alt: "Aexon Laser Pro dry direct imager, a compact white and black unit with a touchscreen on the output tray",
    highlights: [
      {
        title: "508 DPI resolution",
        body: "Crisp lines and smooth tones for confident reading.",
      },
      {
        title: "Touchscreen control",
        body: "An English interface on a colour touchscreen. Staff learn it in minutes.",
      },
      {
        title: "Dry direct imaging",
        body: "No chemicals to buy, store or dispose of.",
      },
      {
        title: "Compact footprint",
        body: "Sits on a bench or trolley in rooms where floor space is tight.",
      },
    ],
    hotspots: [
      {
        x: 50,
        y: 32,
        title: "Output tray",
        body: "Film lands on the front tray, dry and ready to read.",
      },
      {
        x: 49,
        y: 52,
        title: "Touchscreen console",
        body: "Colour touchscreen with an English interface.",
      },
      {
        x: 50,
        y: 86,
        title: "Film drawers",
        body: "Front drawers for loading film without tools.",
      },
    ],
    specs: [
      { label: "Imaging technology", value: "Dry direct" },
      { label: "Resolution", value: "508 DPI" },
      { label: "Controls", value: "Colour touchscreen, English interface" },
      { label: "Form factor", value: "Desktop" },
      { label: "Film sizes", value: null },
      { label: "Throughput", value: null },
      { label: "Connectivity", value: null },
      { label: "Dimensions and weight", value: null },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const faqs: { q: string; a: string }[] = [
  {
    q: "Do you sell directly to hospitals?",
    a: "We supply through authorised distributors in the UK and Bangladesh. Send a quote request with your location and we will put you in touch with the right partner, or quote you directly where no partner covers your area.",
  },
  {
    q: "How do I become an Aexon distributor?",
    a: "Choose “Distributor or reseller” in the quote form and tell us which region you cover. Our team will reply within 24 hours to talk through pricing and terms.",
  },
  {
    q: "What is a dry laser imager?",
    a: "A dry laser imager prints diagnostic images onto film using heat and a laser instead of wet chemistry. There is no developer or fixer to manage and no darkroom to maintain.",
  },
  {
    q: "What is the difference between the Laser Prime and the Laser Pro?",
    a: "The Laser Prime is a floor standing unit with two film trays for departments with high print volumes. The Laser Pro is a compact desktop imager that prints at 508 DPI, suited to clinics and smaller rooms.",
  },
  {
    q: "Where are Aexon products made?",
    a: "Aexon Healthcare Limited designs and manufactures its imagers in the UK. Our office is in Middlesbrough.",
  },
  {
    q: "Which regions do you supply?",
    a: "We currently supply the United Kingdom and Bangladesh. If you are elsewhere, send a request anyway and we will tell you what is possible.",
  },
  {
    q: "How quickly will I get a quote?",
    a: "We reply to every request within 24 hours. Include your expected volume and the product you are interested in to get an accurate price first time.",
  },
  {
    q: "Can I get full specifications before buying?",
    a: "Yes. Request a quote and mention the product. We will send the full specification sheet with your pricing.",
  },
];

/**
 * Social proof. Replace with real, approved quotes from distributors or
 * hospitals. Entries containing `{{` are hidden in production builds.
 */
export const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote: "{{testimonial_quote_from_a_distributor}}",
    name: "{{full_name}}",
    role: "{{role_and_company}}",
  },
  {
    quote: "{{testimonial_quote_from_a_hospital}}",
    name: "{{full_name}}",
    role: "{{role_and_hospital}}",
  },
];

export const isPlaceholder = (s: string) => s.includes("{{");
