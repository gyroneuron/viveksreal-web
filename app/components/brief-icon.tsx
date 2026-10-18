export type BriefIconName =
  | "name"
  | "brand"
  | "email"
  | "product"
  | "goal"
  | "timing"
  | "budget"
  | "reference"
  | "close";
const paths: Record<BriefIconName, React.ReactNode> = {
  name: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </>
  ),
  brand: (
    <>
      <path d="M5 21V4h14v17M3 21h18M9 7h1m4 0h1M9 11h1m4 0h1M10 21v-5h4v5" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  product: (
    <>
      <path
        d="m10 13 4-4m-6 6-1.5 1.5a3.54 3.54 0 0 0 5 5L15 19m-6-2-2-2m3-10 2.5-2.5a3.54 3.54 0 0 1 5 5L15 10"
        transform="translate(1 -1)"
      />
    </>
  ),
  goal: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="m12 12 7-7m-2-2h4v4" />
    </>
  ),
  timing: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2" />
    </>
  ),
  budget: (
    <>
      <path d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
    </>
  ),
  reference: (
    <>
      <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4Z" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
};
export function BriefIcon({ name }: { name: BriefIconName }) {
  return (
    <svg
      className="brief-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
