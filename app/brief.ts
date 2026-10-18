import { contact } from "./content";

export const budgetRanges = [
  { id: "under-250", label: "Under $250", min: 0, max: 250 },
  { id: "250-500", label: "$250–$500", min: 250, max: 500 },
  { id: "500-1000", label: "$500–$1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "$1,000–$2,500", min: 1000, max: 2500 },
  { id: "2500-plus", label: "$2,500+", min: 2500, max: null },
  { id: "discuss", label: "Let’s discuss", min: null, max: null },
] as const;
export type BudgetId = (typeof budgetRanges)[number]["id"];
export type ExchangeRate = { date: string; rate: number };
export type BriefAnswers = {
  name: string;
  brand: string;
  email: string;
  product: string;
  goal: string;
  timing: string;
  budget: BudgetId;
  reference: string;
};
export const emptyBrief: BriefAnswers = {
  name: "",
  brand: "",
  email: "",
  product: "",
  goal: "",
  timing: "Flexible",
  budget: "discuss",
  reference: "",
};
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
export function budgetLabel(id: BudgetId) {
  const option = budgetRanges.find((option) => option.id === id)!;
  return option.id === "discuss" ? option.label : `${option.label} USD`;
}
export function budgetInr(id: BudgetId, rate: number) {
  const option = budgetRanges.find((option) => option.id === id)!;
  if (option.min === null || !Number.isFinite(rate) || rate <= 0) return null;
  if (option.min === 0 && option.max !== null)
    return `Under ${inr.format(option.max * rate)}`;
  if (option.max === null) return `${inr.format(option.min * rate)}+`;
  return `${inr.format(option.min * rate)}–${inr.format(option.max * rate)}`;
}
export function briefDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}
export function formatBrief(
  answers: BriefAnswers,
  exchange?: ExchangeRate | null,
) {
  const section = (label: string, value: string) =>
    `${label}\r\n${value
      .trim()
      .split(/\r?\n/)
      .map((line) => `  ${line}`)
      .join("\r\n")}`;
  const estimate = exchange ? budgetInr(answers.budget, exchange.rate) : null;
  return [
    "CAMPAIGN BRIEF",
    section("Brand / company", answers.brand),
    section("Contact name", answers.name),
    section("Contact email", answers.email),
    section("Product / campaign link", answers.product),
    section("Campaign goal", answers.goal),
    section("Preferred timing", briefDate(answers.timing)),
    section("Planned budget", budgetLabel(answers.budget)),
    ...(estimate && exchange
      ? [
          section(
            "Approximate INR equivalent",
            `${estimate}\n1 USD = INR ${exchange.rate.toFixed(2)}; reference rate ${briefDate(exchange.date)} (Frankfurter). Estimate only.`,
          ),
        ]
      : []),
    ...(answers.reference.trim()
      ? [section("Campaign reference", answers.reference)]
      : []),
  ].join("\r\n\r\n");
}
export function briefEmail(
  answers: BriefAnswers,
  exchange?: ExchangeRate | null,
) {
  const subject = `Brand collaboration — ${answers.brand.trim().replace(/[\r\n]+/g, " ")}`;
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatBrief(answers, exchange))}`;
}

export const formspreeEndpoint = "https://formspree.io/f/xrpejkob";
export function formspreePayload(
  answers: BriefAnswers,
  exchange: ExchangeRate | null,
  page: string,
): Record<string, string> {
  const estimate = exchange ? budgetInr(answers.budget, exchange.rate) : null;
  return {
    name: answers.name.trim(),
    email: answers.email.trim(),
    brand: answers.brand.trim(),
    product: answers.product.trim(),
    goal: answers.goal.trim(),
    timing: briefDate(answers.timing),
    launch_date: answers.timing,
    budget: budgetLabel(answers.budget),
    budget_range: answers.budget,
    ...(estimate && exchange
      ? {
          inr_estimate: estimate,
          usd_inr_rate: String(exchange.rate),
          rate_date: exchange.date,
        }
      : {}),
    reference: answers.reference.trim(),
    message: formatBrief(answers, exchange),
    _subject: `Campaign brief — ${answers.brand.trim().replace(/[\r\n]+/g, " ")}`,
    source_page: page,
  };
}
