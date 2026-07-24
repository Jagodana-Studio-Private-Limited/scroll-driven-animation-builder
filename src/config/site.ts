export const siteConfig = {
  // ====== TOOL CONFIG ======
  name: "Scroll-Driven Animation Builder",
  title: "CSS Scroll-Driven Animation Builder — Build & Preview scroll() Animations",
  description:
    "Visually build CSS scroll-driven animations using animation-timeline: scroll(). Configure animation-range, easing, keyframes, and copy ready-to-use CSS code instantly.",
  url: "https://scroll-driven-animation-builder.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Zap",
  brandAccentColor: "#a855f7",

  // SEO
  keywords: [
    "css scroll driven animation",
    "animation-timeline scroll",
    "scroll animation builder",
    "animation-range css",
    "css scroll animation generator",
    "scroll linked animation",
    "css animation timeline tool",
    "view timeline css",
    "scroll progress animation",
    "css animation builder",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#7c3aed",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/scroll-driven-animation-builder",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Build CSS scroll-driven animations visually. Configure animation-timeline, animation-range, keyframes and easing — then copy the ready-to-use CSS.",
    featuresTitle: "Features",
    features: [
      "Live scroll preview",
      "animation-range controls",
      "Multiple CSS properties",
      "One-click CSS copy",
    ],
  },

  hero: {
    badge: "CSS Scroll-Driven Animations",
    titleLine1: "Build Scroll Animations",
    titleGradient: "Without the Guesswork",
    subtitle:
      "Visually configure animation-timeline: scroll(), set animation-range start/end, choose your easing — and instantly copy the CSS. No JavaScript needed.",
  },

  featureCards: [
    {
      icon: "🎢",
      title: "Live Scroll Preview",
      description:
        "See your animation play in real time as you scroll inside the preview panel.",
    },
    {
      icon: "🎯",
      title: "animation-range Controls",
      description:
        "Fine-tune when the animation starts and ends using cover, contain, entry, and exit keywords.",
    },
    {
      icon: "📋",
      title: "Copy-Ready CSS",
      description:
        "Get clean, production-ready CSS with @keyframes and animation shorthand — one click to copy.",
    },
  ],

  relatedTools: [
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Generate beautiful CSS gradients with live preview.",
    },
    {
      name: "Border Radius Generator",
      url: "https://border-radius-generator.tools.jagodana.com",
      icon: "⬜",
      description: "Visually set border-radius and copy the CSS.",
    },
    {
      name: "CSS Box Shadow Generator",
      url: "https://css-box-shadow-generator.tools.jagodana.com",
      icon: "🌫️",
      description: "Build layered box-shadows with a live editor.",
    },
    {
      name: "Color Palette Generator",
      url: "https://color-palette-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate harmonious color palettes for your project.",
    },
    {
      name: "Regex Tester",
      url: "https://regex-tester.tools.jagodana.com",
      icon: "🔍",
      description: "Build and test regular expressions in real time.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "{}",
      description: "Format, validate and minify JSON with syntax highlighting.",
    },
  ],

  howToSteps: [
    {
      name: "Choose an animation property",
      text: "Select the CSS property you want to animate on scroll — opacity, scale, translateY, rotate, and more.",
      url: "",
    },
    {
      name: "Set animation-range",
      text: "Use the range controls to define when (in scroll progress) the animation starts and ends using cover, contain, entry, or exit keywords.",
      url: "",
    },
    {
      name: "Copy the generated CSS",
      text: "Preview the animation live in the scroll box, then click Copy CSS to get production-ready @keyframes and animation code.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is a CSS scroll-driven animation?",
      answer:
        "A CSS scroll-driven animation links an animation's progress to the scroll position of a container or the page. Using animation-timeline: scroll(), the animation plays forward as you scroll down and reverses as you scroll up — no JavaScript required.",
    },
    {
      question: "What does animation-range do?",
      answer:
        "animation-range controls which portion of the scroll progress triggers the animation. For example, animation-range: cover 20% cover 80% means the animation starts when the element is 20% into the viewport and finishes when it's 80% through. Keywords include cover, contain, entry, and exit.",
    },
    {
      question: "Do scroll-driven animations work in all browsers?",
      answer:
        "Scroll-driven animations (animation-timeline: scroll() and view()) are supported in Chrome 115+, Edge 115+, and Opera. Firefox support is available behind a flag. For Safari and older browsers, consider a JavaScript fallback or use @supports to progressively enhance.",
    },
    {
      question: "What is the difference between scroll() and view() timeline?",
      answer:
        "scroll() links the animation to the scroll progress of a scroll container (how far the page or a div has been scrolled). view() links it to the element's position inside the viewport — ideal for entrance animations when an element scrolls into view. This tool uses scroll() for precise scroll-position control.",
    },
    {
      question: "Can I animate multiple properties at once?",
      answer:
        "Yes! CSS @keyframes can animate multiple properties simultaneously. In this builder, choose one property to prototype quickly. For multiple properties, combine the generated @keyframes — add extra property declarations inside the from {} and to {} blocks.",
    },
    {
      question: "Does this require JavaScript?",
      answer:
        "No. The generated CSS is 100% pure CSS. animation-timeline: scroll() is a native CSS feature and requires no JavaScript at runtime.",
    },
  ],

  pages: {
    "/": {
      title: "CSS Scroll-Driven Animation Builder — Build & Preview scroll() Animations",
      description:
        "Visually build CSS scroll-driven animations using animation-timeline: scroll(). Configure animation-range, easing, keyframes, and copy ready-to-use CSS code instantly.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
