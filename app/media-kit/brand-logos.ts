export type BrandLogo = {
  id: string;
  name: string | null;
  src: string;
  status: "completed" | "upcoming" | "enquiry-only" | "unconfirmed";
  caseHref: string | null;
  sourceFile: string;
  canvas: { width: number; height: number };
  bounds: { x: number; y: number; width: number; height: number };
  displayWidth: number;
  mobileWidth: number;
};

// Only completed partnerships are rendered in the main grid. Logo possession
// alone is not relationship evidence. Original transparent files are unchanged.
export const brandLogos: BrandLogo[] = [
  {
    id: "propeers",
    name: "ProPeers",
    src: "/media/brands/propeers.png",
    status: "completed",
    caseHref: "#case-propeers",
    sourceFile: "Charcoal speech-bubble logo-7.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 156, y: 128, width: 942, height: 1042 },
    displayWidth: 64,
    mobileWidth: 56,
  },
  {
    id: "hive-school",
    name: "Hive School",
    src: "/media/brands/hive-school.png",
    status: "completed",
    caseHref: "#case-hive-school",
    sourceFile: "Monochrome Graduation Cap Logo-6.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 409, y: 231, width: 484, height: 791 },
    displayWidth: 44,
    mobileWidth: 36,
  },
  {
    id: "dailyobjects",
    name: "DailyObjects",
    src: "/media/brands/dailyobjects.png",
    status: "completed",
    caseHref: "#case-dailyobjects",
    sourceFile: "Monochrome DailyObjects logo asset-5.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 96, y: 569, width: 1083, height: 140 },
    displayWidth: 190,
    mobileWidth: 132,
  },
  {
    id: "united-stores",
    name: "United Stores",
    src: "/media/brands/united-stores.png",
    status: "completed",
    caseHref: null,
    sourceFile: "United Stores monochrome logo cleanup-8.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 139, y: 281, width: 979, height: 759 },
    displayWidth: 108,
    mobileWidth: 84,
  },
  {
    id: "cupi",
    name: "CUPI",
    src: "/media/brands/cupi.png",
    status: "upcoming",
    caseHref: null,
    sourceFile: "Monochrome CUPI Cat Logo-1.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 136, y: 531, width: 992, height: 247 },
    displayWidth: 158,
    mobileWidth: 122,
  },
  {
    id: "t-hub",
    name: "t-hub",
    src: "/media/brands/t-hub.png",
    status: "upcoming",
    caseHref: null,
    sourceFile: "Monochrome t-hub orbit logo-2.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 203, y: 272, width: 848, height: 710 },
    displayWidth: 96,
    mobileWidth: 80,
  },
  {
    id: "einig",
    name: "EINIG",
    src: "/media/brands/einig.png",
    status: "completed",
    caseHref: null,
    sourceFile: "Monochrome angular wing badge-4.png",
    canvas: { width: 1254, height: 1254 },
    bounds: { x: 92, y: 114, width: 1070, height: 1077 },
    displayWidth: 68,
    mobileWidth: 60,
  },
];
