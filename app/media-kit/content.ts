import { campaigns, propeersResults, recentProof, questions } from "../content";
import type { Campaign } from "../content";
import { audienceInsights } from "../audience-insights";

export type MetricRecord = {
  id: string;
  value: string;
  unit: string;
  platform: "Instagram";
  population_or_scope: string;
  period_start: string | null;
  period_end: string | null;
  captured_at: string;
  source: string;
  post_or_campaign_id: string | null;
  delivery_status: "unknown";
  verification_status: "source-checked";
};

function metric(
  id: string,
  value: string,
  unit: string,
  scope: string,
  captured: string,
  source: string,
  post: string | null,
  start: string | null,
  end: string | null,
): MetricRecord {
  return {
    id,
    value,
    unit,
    platform: "Instagram",
    population_or_scope: scope,
    period_start: start,
    period_end: end,
    captured_at: captured,
    source,
    post_or_campaign_id: post,
    delivery_status: "unknown",
    verification_status: "source-checked",
  };
}

// Shared values derive from the homepage source of truth, not the AI summary.
export const accountSnapshot = recentProof.metrics.map((item) =>
  metric(
    item.id,
    item.value,
    item.label,
    item.scope,
    item.id === "followers"
      ? recentProof.followerSnapshot.date
      : recentProof.exportDate,
    recentProof.source,
    null,
    item.id === "followers" ? null : recentProof.period.start,
    item.id === "followers" ? null : recentProof.period.end,
  ),
);
export const leadResults = propeersResults.metrics.map((item, index) =>
  metric(
    `propeers-${index}`,
    item.value,
    item.label,
    "Cumulative Reel results; rounded as exported",
    propeersResults.cutoff,
    propeersResults.source,
    campaigns[0].reelId,
    propeersResults.posted,
    propeersResults.cutoff,
  ),
);
export const leadInteractions = [
  metric(
    "propeers-likes",
    "1.6K",
    "Likes",
    "Cumulative Reel interactions",
    propeersResults.cutoff,
    propeersResults.source,
    campaigns[0].reelId,
    propeersResults.posted,
    propeersResults.cutoff,
  ),
  metric(
    "propeers-shares",
    "3.2K",
    "Shares",
    "Cumulative Reel interactions",
    propeersResults.cutoff,
    propeersResults.source,
    campaigns[0].reelId,
    propeersResults.posted,
    propeersResults.cutoff,
  ),
  metric(
    "propeers-reposts",
    "39",
    "Reposts",
    "Cumulative Reel interactions",
    propeersResults.cutoff,
    propeersResults.source,
    campaigns[0].reelId,
    propeersResults.posted,
    propeersResults.cutoff,
  ),
];

// Demographics now use the matched follower export; unavailable language stays unset.
export const demographics = {
  base: audienceInsights.population,
  captured_at: audienceInsights.capturedAt,
  source: audienceInsights.source,
  period: audienceInsights.period,
  ages: audienceInsights.ages,
  countries: audienceInsights.countries,
  cities: audienceInsights.cities,
  gender: audienceInsights.gender,
  audience_language: null,
};
export const comparableCohort = {
  publication_start: null,
  publication_end: null,
  captured_at: null,
  eligible_posts: null,
  median_views: null,
};
export const kitDownload = null;
export const partnershipDetails = campaigns.map((campaign) => ({
  campaign_id: campaign.id,
  relationship: "Commissioned partnership",
  relationship_type: "paid",
  publication_date: campaign.id === "propeers" ? propeersResults.posted : null,
  verified_role: ["Concept", "Script", "Filming", "Editing", "Publication"],
  production_roles: ["Concept", "Script", "Filming", "Editing", "Publication"],
  goal: campaign.description,
  format: "Instagram Reel",
  metric_cutoff: campaign.id === "propeers" ? propeersResults.cutoff : null,
  delivery_status: "unknown",
  outcome_attribution: null,
}));

export type Highlight = {
  campaign: Campaign;
  posted: string | null;
  dateLabel: string | null;
  localVideo: boolean;
  angle: string;
  metrics: MetricRecord[];
  interactions: MetricRecord[];
};
function highlightMetric(
  id: string,
  value: string,
  label: string,
  post: string,
  posted: string,
  source: string,
) {
  return metric(
    id,
    value,
    label,
    "Cumulative individual Reel snapshot; rounded as exported",
    "2026-10-17",
    source,
    post,
    posted,
    "2026-10-17",
  );
}
function buildHighlight(
  id: string,
  index: string,
  title: string,
  description: string,
  reelId: string,
  posted: string,
  dateLabel: string,
  localVideo: boolean,
  angle: string,
  values: [string, string][],
  interactions: [string, string][],
  source: string,
): Highlight {
  return {
    campaign: {
      id,
      index,
      brand: title,
      category: "Independent editorial",
      title,
      description,
      reelId,
      url: `https://www.instagram.com/reel/${reelId}/`,
      image: `/media/${id}.jpg`,
      alt: `Original cover of Vivek’s ${title} Reel`,
    },
    posted,
    dateLabel,
    localVideo,
    angle,
    metrics: values.map(([value, label], i) =>
      highlightMetric(`${id}-${i}`, value, label, reelId, posted, source),
    ),
    interactions: interactions.map(([value, label], i) =>
      highlightMetric(
        `${id}-interaction-${i}`,
        value,
        label,
        reelId,
        posted,
        source,
      ),
    ),
  };
}

// Captions in the supplied Edits exports match these Reel embeds. Jan 3 is this
// post's date, not the Dec 23, 2025 start of public posting.
export const highlights: Highlight[] = [
  buildHighlight(
    "intro-story",
    "01",
    "An introduction that started conversations.",
    "An invitation for founders and builders to introduce themselves and the ideas they’re working on.",
    "DTC8DHrExEw",
    "2026-01-03",
    "3 Jan 2026",
    false,
    "A simple invitation, with the conversation in the comments.",
    [
      ["185K", "Views"],
      ["113K", "Accounts reached"],
    ],
    [
      ["5.1K", "Likes"],
      ["1.9K", "Comments"],
      ["1.6K", "Shares"],
      ["1.6K", "Saves"],
    ],
    "Instagram Edits · Intro-video-insights.png",
  ),
  buildHighlight(
    "founder-circle",
    "02",
    "Building Founder Circle.",
    "A creator-led invitation to connect with other people building their first startup.",
    "DaNY76UzLoU",
    "2026-06-30",
    "30 Jun 2026",
    true,
    "Community storytelling, built around a shared starting point.",
    [
      ["211K", "Views"],
      ["13K", "Comments"],
    ],
    [
      ["7.1K", "Likes"],
      ["2.8K", "Shares"],
      ["3.7K", "Saves"],
    ],
    "Instagram Edits · founder-circle-insights.png",
  ),
  buildHighlight(
    "internship-roadmap",
    "03",
    "A first internship, made practical.",
    "A personal learning pathway connecting a first-year internship story with a useful roadmap.",
    "DT28gkrE5RD",
    "2026-01-23",
    "23 Jan 2026",
    false,
    "A personal experience translated into a resource viewers can return to.",
    [
      ["276K", "Views"],
      ["6.8K", "Saves"],
    ],
    [
      ["189K", "Accounts reached"],
      ["8.5K", "Likes"],
      ["8.2K", "Comments"],
      ["7.2K", "Shares"],
    ],
    "Instagram Edits · internship-roadmap-insights.png",
  ),
];

export const kitQuestions = [
  ...questions.slice(0, 3),
  {
    question: "What reporting can we agree on?",
    answer:
      "We agree on the metrics, reporting date, and available platform Insights in the proposal. Content interaction is reported separately from tracked clicks, registrations, or sales; those outcomes need their own tracking and attribution.",
  },
  {
    question: "Do historical results guarantee future performance?",
    answer:
      "No. The figures on this page are dated historical snapshots. They do not guarantee future views, audience delivery, enquiries, or sales.",
  },
];
