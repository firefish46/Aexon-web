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
  /** surface point on the 3D model, "x y z" in model units; used when the product has a model */
  position?: string;
  /** surface normal at that point, "x y z" */
  normal?: string;
  title: string;
  body: string;
};

export type ChipShowcase = {
  /** photo of the main board; without one the board and chip are drawn */
  image?: string;
  /** text on the drawn chip's lid, first line largest */
  marking?: string[];
  alt: string;
  title: string;
  body: string;
  /** what the controller does, in order; shown as the data path in the animation */
  steps: { title: string; body: string }[];
};

export type ConsoleTour = {
  /** which drawn screen to show */
  screen?: "laser-pro" | "laser-prime";
  image?: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  title: string;
  body: string;
  /** parts of the screen; rect is [left, top, width, height] in percent of the image */
  regions: { title: string; body: string; rect: [number, number, number, number] }[];
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
  /** optional GLB model, shown in place of the photo when present */
  model?: string;
  /** how the 3D model is lit; light models need softer highlights so their tops keep their shape */
  modelLook?: { exposure?: number; toneMapping?: "neutral" | "agx" | "aces" };
  highlights: { title: string; body: string }[];
  hotspots: Hotspot[];
  /** optional "inside the machine" section with the main board controller */
  chip?: ChipShowcase;
  /** optional guided tour of the touchscreen */
  console?: ConsoleTour;
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
    model: "/models/laser-prime.glb",
    modelLook: { exposure: 1, toneMapping: "aces" },
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
        position: "-0.18m 0.993m 0.155m",
        normal: "0m 1m 0m",
        title: "Film output",
        body: "Finished film exits at the top, dry and ready to read.",
      },
      {
        x: 57,
        y: 17,
        position: "0.178m 0.872m 0.334m",
        normal: "0m 0.4m 1m",
        title: "Touchscreen console",
        body: "Large backlit LCD touchscreen showing status, alarms and faults.",
      },
      {
        x: 37,
        y: 66,
        position: "-0.015m 0.32m 0.364m",
        normal: "0m 0m 1m",
        title: "Two film trays",
        body: "Up to 150 sheets per tray, loaded from the front.",
      },
      {
        x: 22,
        y: 94,
        position: "-0.27m 0.031m 0.307m",
        normal: "0m 0m 1m",
        title: "Castors",
        body: "Roll the 191 kg unit into place and reposition it when the room changes.",
      },
    ],
    chip: {
      marking: ["FPGA", "SYSTEM ON CHIP"],
      alt: "Illustration of the Laser Prime controller, a system on chip FPGA on the main board",
      title: "An FPGA controller keeps 130 sheets an hour on time",
      body: "The Laser Prime is run by a system on chip FPGA. Its processor cores handle the network and DICOM, and its programmable logic drives the laser line by line.",
      steps: [
        {
          title: "Receives",
          body: "Images arrive from your PACS or modality over DICOM 3.0 on the gigabit Ethernet port.",
        },
        {
          title: "Processes",
          body: "Each image is mapped to 14 bit greyscale, with the built in densitometer's calibration applied to every sheet.",
        },
        {
          title: "Prints",
          body: "The logic times the laser for every line at 508 dpi, fast enough for 130 or more 14×17 in sheets an hour.",
        },
      ],
    },
    console: {
      screen: "laser-prime",
      imageWidth: 1600,
      imageHeight: 860,
      alt: "Laser Prime touchscreen showing a Ready status, film left in both trays, alarms and faults, and Calibrate, Settings and Maintain buttons",
      title: "Status, alarms and faults at a glance",
      body: "The large backlit touchscreen shows what the imager is doing, how much film is left and anything that needs attention.",
      regions: [
        {
          title: "Printer status",
          body: "Whether the imager is ready, the last job it printed, sheets printed today and when density was last calibrated.",
          rect: [1.9, 12.8, 46.9, 52.3],
        },
        {
          title: "Film trays",
          body: "Film size and sheets left in each 150 sheet tray, with a warning before a tray runs out.",
          rect: [50.6, 12.8, 47.5, 52.3],
        },
        {
          title: "Alarms and faults",
          body: "Active faults and recent alerts, each with the time it happened.",
          rect: [1.9, 67.4, 46.9, 29.1],
        },
        {
          title: "One touch controls",
          body: "Calibration, settings and maintenance, each a single tap away.",
          rect: [51.7, 67.4, 46.4, 29.1],
        },
      ],
    },
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
    model: "/models/laser-pro.glb",
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
        position: "-0.498m 0.299m 0.474m",
        normal: "0m 1m 0m",
        title: "Output tray",
        body: "Film lands on the front tray, dry and ready to read.",
      },
      {
        x: 49,
        y: 52,
        position: "-0.027m 0.233m 0.666m",
        normal: "0m 1m 0.04m",
        title: "Touchscreen console",
        body: "Shows Online, Alert, Fault and Active status at a glance.",
      },
      {
        x: 50,
        y: 86,
        position: "0.4m -0.2m 0.97m",
        normal: "0m 0m 1m",
        title: "Two supply trays",
        body: "100 sheets in each tray, loaded from the front.",
      },
    ],
    chip: {
      image: "/products/laser-pro/dascom-chip.webp",
      alt: "DASCOM DS1301 controller chip on the Laser Pro main board",
      title: "One controller runs every print",
      body: "At the centre of the Laser Pro main board sits a DASCOM DS1301 controller. Every image you send passes through it on the way to film.",
      steps: [
        {
          title: "Receives",
          body: "Images arrive from your PACS or modality over DICOM 3.0 on the Ethernet port.",
        },
        {
          title: "Processes",
          body: "Each image is prepared for film in 14 bit greyscale, with automatic calibration keeping density consistent.",
        },
        {
          title: "Prints",
          body: "The print engine writes the film at 508 dpi, with the first sheet out in 75 seconds or less.",
        },
      ],
    },
    console: {
      image: "/products/laser-pro/touch-console.webp",
      imageWidth: 1600,
      imageHeight: 860,
      alt: "Laser Pro touchscreen showing printer status, upper and lower tray status, the print queue by film size, and Settings, Maintain and Open buttons",
      title: "Everything you need, on the printer itself",
      body: "The touchscreen shows what the imager is doing and what is waiting, so staff rarely need to walk back to a workstation.",
      regions: [
        {
          title: "Printer status",
          body: "Current state, the sending device and pages in the job, with a button to pause printing.",
          rect: [1.8, 0.4, 47.4, 96.4],
        },
        {
          title: "Tray status",
          body: "Upper and lower trays read the film's RF tag and show the size that is loaded.",
          rect: [50.8, 0.8, 46.9, 26.4],
        },
        {
          title: "Print queue",
          body: "Sheets waiting for each film size: 8×10, 10×12, 11×14 and 14×17 in.",
          rect: [50.4, 31, 47.8, 37.6],
        },
        {
          title: "One touch controls",
          body: "Settings, maintenance and tray release, each a single tap away.",
          rect: [51.4, 71, 46.4, 25.6],
        },
      ],
    },
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
