import { audienceInsights } from "./audience-insights";

export const contact = {
  email: "viveksreal@gmail.com",
  instagram: "https://www.instagram.com/viveksreal/",
  linkedin: "https://www.linkedin.com/in/vivekjaglan/",
  booking: "https://cal.com/vivekjaglan/30min",
  whatsapp: "https://wa.me/918968526279",
};

// Performance: supplied two-page Instagram Edits export, 16 Oct 2026.
// Followers: refreshed separately from the Follower insights export, 17 Oct 2026.
// Preserve its rounded display values and labels: "Viewers" is not relabelled as reach.
// Creation metadata dates this export to 16 Oct; its reporting period ends 15 Oct.
export const recentProof = {
  source: "Instagram Edits export",
  exportDate: "2026-10-16",
  followerSnapshot: {
    date: audienceInsights.capturedAt,
    label: audienceInsights.capturedLabel,
    exact: audienceInsights.followers,
  },
  period: { start: "2026-07-17", end: "2026-10-15", reportedDays: 90 },
  metrics: [
    {
      id: "followers",
      value: "21.5K",
      label: "Instagram followers",
      scope: `${audienceInsights.followers.toLocaleString("en-IN")} in follower export`,
    },
    {
      id: "reel-views",
      value: "283K",
      label: "Reel views",
      scope: "Reels · 90-day report",
    },
    {
      id: "viewers",
      value: "180K",
      label: "Viewers",
      scope: "Reels + posts · 90-day report",
    },
  ],
};

// Supplied Reel-specific Edits PDF; values are rounded as printed, not exact totals.
export const propeersResults = {
  posted: "2026-02-21",
  cutoff: "2026-10-16",
  source: "Instagram Edits export",
  metrics: [
    { value: "115K", label: "Views" },
    { value: "3.7K", label: "Saves" },
    { value: "6K", label: "Comments" },
  ],
};

export type Campaign = {
  id: string;
  index: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  reelId: string;
  url: string;
  image: string;
  alt: string;
  captions?: { src: string; language: string; label: string }[];
};

// Relationships and Reel identities supplied directly by Vivek, 16 October 2026.
// ProPeers now has a supplied Reel-specific source; other case metrics stay excluded.
export const campaigns: Campaign[] = [
  {
    id: "propeers",
    index: "01",
    brand: "ProPeers",
    category: "Technology & learning",
    title: "A roadmap worth coming back to.",
    description:
      "A developer-roadmap collaboration for people planning their next learning step.",
    reelId: "DVBDHaFk8qh",
    url: "https://www.instagram.com/reel/DVBDHaFk8qh/",
    image: "/media/propeers.jpg",
    alt: "Original cover of Vivek’s ProPeers developer-roadmap Reel",
  },
  {
    id: "hive-school",
    index: "02",
    brand: "Hive School",
    category: "Careers & learning",
    title: "A new way to learn.",
    description:
      "Introducing a business and AI bootcamp. A collaboration around a five-day learning experience in Gurugram.",
    reelId: "DdJ8UGJsqCr",
    url: "https://www.instagram.com/reel/DdJ8UGJsqCr/",
    image: "/media/hive-school.jpg",
    alt: "Original cover of Vivek’s Hive School collaboration Reel",
  },
  {
    id: "dailyobjects",
    index: "03",
    brand: "DailyObjects",
    category: "Everyday technology",
    title: "Part of the everyday.",
    description:
      "Everyday tools in a working setup. Product storytelling grounded in the way I work.",
    reelId: "Dc3GVQuMcC-",
    url: "https://www.instagram.com/reel/Dc3GVQuMcC-/",
    image: "/media/dailyobjects.jpg",
    alt: "Original cover of Vivek’s DailyObjects collaboration Reel",
  },
];

// Personal historical milestones supplied by Vivek, 16 October 2026.
// Vivek confirmed yearless dates are in 2026; public posting began in 2025.
// These are distinct from campaign results and current account Insights.
export const milestones = [
  {
    id: "first-public-video",
    date: "2025-12-23",
    dateLabel: "23 Dec 2025",
    value: "Start.",
    unit: "First public video",
    detail: "From a private account to sharing publicly.",
    kind: "start",
  },
  {
    id: "1k-followers",
    date: "2026-01-13",
    dateLabel: "13 Jan 2026",
    value: "1K",
    unit: "Instagram followers",
    detail: "The first thousand following along.",
    kind: "followers",
  },
  {
    id: "1m-account-views",
    date: "2026-01-24",
    dateLabel: "24 Jan 2026",
    value: "1M",
    unit: "views across my account",
    detail: "An account-wide milestone.",
    kind: "views",
  },
  {
    id: "10k-followers",
    date: "2026-03-03",
    dateLabel: "03 Mar 2026",
    value: "10K",
    unit: "Instagram followers",
    detail: "A five-figure community.",
    kind: "followers",
  },
  {
    id: "20k-followers",
    date: "2026-07-02",
    dateLabel: "02 Jul 2026",
    value: "20K",
    unit: "Instagram followers",
    detail: "Another chapter in the journey.",
    kind: "followers",
  },
  {
    id: "first-product-collaboration",
    date: "2026-09-04",
    dateLabel: "04 Sep 2026",
    value: "A first.",
    unit: "Product collaboration",
    detail: "A screen protector, a new format.",
    kind: "collaboration",
  },
];

export const questions = [
  {
    question: "Do you post on your account or create for ours?",
    answer:
      "Both can be scoped separately. An Instagram partnership includes agreed publishing on @viveksreal. UGC is content made for your brand’s channels; audience distribution is a separate part of the scope.",
  },
  {
    question: "Can we use the content in ads?",
    answer:
      "Paid usage can be included in the proposal with agreed duration and channels. Partnership ads, additional versions, raw footage, and exclusivity are discussed separately.",
  },
  {
    question: "What does a collaboration cost?",
    answer:
      "Pricing depends on the content, distribution, timing, and usage. Share your product, goal, and budget range so we can discuss a suitable format and a custom quote.",
  },
  {
    question: "Can you guarantee views or sales?",
    answer:
      "No. Views and sales cannot be guaranteed. We agree on the content and reporting scope for each campaign, with relevant past results shared where available.",
  },
];
