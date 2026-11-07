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
  /** Public email shown in the footer. Leave as a placeholder to hide it. */
  email: "{{sales_email}}",
  /** Where quote requests are emailed (override with QUOTE_TO on the server). */
  quoteInbox: "cmo@dmebd.com",
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
    type: "Dry laser imager",
    tagline: "130 sheets an hour for busy imaging departments",
    summary:
      "A floor standing dry laser imager with two 150 sheet trays, gigabit DICOM networking and automatic calibration, built for departments that print film all day.",
    image: "/products/laser-prime.png",
    imageWidth: 783,
    imageHeight: 1068,
    alt: "Aexon Laser Prime dry laser imager, a white floor standing unit with a touchscreen and two blue film trays",
    highlights: [
      {
        title: "130+ sheets an hour",
        body: "At least 130 sheets of 14×17 in film per hour, and 200 or more at 8×10 in.",
      },
      {
        title: "508 DPI, 14 bit greyscale",
        body: "20 pixels per millimetre and 14 bits of greyscale for fine detail and smooth tones.",
      },
      {
        title: "300 sheets loaded",
        body: "Two trays hold up to 150 sheets each, across five film sizes from 8×10 to 14×17 in.",
      },
      {
        title: "Calibrates itself",
        body: "A built in densitometer runs automatic calibration so film stays consistent.",
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
        body: "Large backlit LCD touchscreen showing status, alarms and faults.",
      },
      {
        x: 37,
        y: 66,
        title: "Two film trays",
        body: "Up to 150 sheets per tray, loaded from the front.",
      },
      {
        x: 22,
        y: 94,
        title: "Castors",
        body: "Roll the 191 kg unit into place and reposition it when the room changes.",
      },
    ],
    specs: [
      { label: "Print technology", value: "Dry laser imaging" },
      { label: "Spatial resolution", value: "508 dpi (20 pixels/mm)" },
      { label: "Throughput", value: "14×17 in: 130 sheets/hour or more\n8×10 in: 200 sheets/hour or more" },
      { label: "Greyscale resolution", value: "14 bits" },
      { label: "Film transfer", value: "Suction" },
      { label: "Film trays", value: "2 trays, up to 150 sheets each" },
      { label: "Film sizes", value: "14×17, 11×14, 10×14, 10×12, 8×10 in" },
      { label: "Interface", value: "10/100/1000 BASE\u2011T Ethernet (RJ45)" },
      { label: "Network protocol", value: "DICOM 3.0" },
      { label: "Image quality", value: "Automatic calibration with built in densitometer" },
      { label: "Control panel", value: "Large backlit LCD touchscreen showing alarms, faults and status" },
      { label: "Power supply", value: "220 VAC, 50 Hz, input power 2000 VA or less" },
      { label: "Weight", value: "191 kg" },
      { label: "Dimensions", value: "680 × 626 × 1108 mm" },
      { label: "Operating temperature", value: "5 °C to 40 °C" },
      { label: "Storage temperature", value: "\u221210 °C to 50 °C" },
      { label: "Storage humidity", value: "10% to 80%" },
    ],
  },
  {
    slug: "laser-pro",
    name: "Aexon Laser Pro",
    type: "Direct dry imager",
    tagline: "508 DPI film that prints in normal room light",
    summary:
      "A compact direct dry imager that runs in room light, prints 75 sheets an hour and connects to your PACS over DICOM 3.0. Sized for clinics, wards and smaller imaging rooms.",
    image: "/products/laser-pro.png",
    imageWidth: 712,
    imageHeight: 731,
    alt: "Aexon Laser Pro direct dry imager, a compact white and black unit with a touchscreen on the output tray",
    highlights: [
      {
        title: "Works in room light",
        body: "Direct dry imaging with no darkroom and no chemicals to buy, store or dispose of.",
      },
      {
        title: "First sheet in 75 seconds",
        body: "Up to 75 sheets of 14×17 in film per hour once it is running.",
      },
      {
        title: "508 DPI, 14 bit greyscale",
        body: "Crisp lines, smooth tones and a maximum density of 3.0.",
      },
      {
        title: "Two trays, four sizes",
        body: "Two 100 sheet supply trays take 8×10, 10×12, 11×14 and 14×17 in film.",
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
        body: "Shows Online, Alert, Fault and Active status at a glance.",
      },
      {
        x: 50,
        y: 86,
        title: "Two supply trays",
        body: "100 sheets in each tray, loaded from the front.",
      },
    ],
    specs: [
      { label: "Print technology", value: "Direct dry imaging, operates in room light" },
      { label: "Resolution", value: "508 dpi" },
      { label: "Print speed", value: "14×17 in: 75 sheets/hour\nFirst sheet in 75 s or less" },
      { label: "Greyscale contrast resolution", value: "14 bits" },
      { label: "Maximum density", value: "3.0 Dmax" },
      { label: "Film transfer", value: "Suction" },
      { label: "Film input", value: "2 supply trays, 100 sheets each" },
      { label: "Film sizes", value: "8×10, 10×12, 11×14, 14×17 in" },
      { label: "Film type", value: "Medical dry thermal film, blue and clear base" },
      { label: "Interface", value: "10/100 BASE\u2011T Ethernet (RJ45)" },
      { label: "Network protocol", value: "DICOM 3.0" },
      { label: "Image quality", value: "Automatic calibration with built in densitometer" },
      { label: "Control panel", value: "Touchscreen showing Online, Alert, Fault and Active" },
      { label: "Power", value: "100 to 240 V ±10%, 3 A, 50/60 Hz, 660 W maximum" },
      { label: "Weight", value: "85 kg" },
      { label: "Dimensions", value: "595 W × 665 L × 597 H mm" },
      { label: "Operating temperature", value: "5 °C to 40 °C" },
      { label: "Storage temperature", value: "\u221220 °C to 40 °C" },
      { label: "Storage humidity", value: "95% or less" },
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
    a: "Both print at 508 dpi with 14 bit greyscale. The Laser Prime is a floor standing unit that prints 130 or more 14×17 in sheets an hour from two 150 sheet trays, for busy departments. The Laser Pro is a compact imager that prints 75 sheets an hour in normal room light from two 100 sheet trays, suited to clinics and smaller rooms.",
  },
  {
    q: "Will it connect to our PACS or modalities?",
    a: "Yes. Both imagers use standard DICOM 3.0 over Ethernet. The Laser Prime has a gigabit port and the Laser Pro a 10/100 port.",
  },
  {
    q: "Which film sizes can I print?",
    a: "The Laser Prime takes 8×10, 10×12, 10×14, 11×14 and 14×17 in film. The Laser Pro takes 8×10, 10×12, 11×14 and 14×17 in medical dry thermal film, blue or clear base.",
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
    a: "The main specifications are on each product page. Request a quote and we will send the full specification sheet with your pricing.",
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
