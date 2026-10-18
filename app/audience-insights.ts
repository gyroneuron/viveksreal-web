// Source: creator-supplied Instagram Edits Follower insights PDF.
// Visually checked 17 Oct 2026. Follower population, not reached/engaged accounts.
export const audienceInsights = {
  platform: "Instagram",
  population: "Followers",
  followers: 21512,
  period: {
    start: "2026-07-18",
    end: "2026-10-16",
    label: "18 Jul–16 Oct 2026",
    reportedDays: 90,
  },
  capturedAt: "2026-10-17",
  capturedLabel: "17 Oct 2026",
  source: "Instagram Edits · Follower insights",
  sourceFile:
    "Account insights for viveksreal - Jul 18, 2026 - Oct 16, 2026.pdf",
  verificationStatus: "source-checked",
  // Coordinates locate representative country/city centres, not individual followers.
  countries: [
    { id: "IND", name: "India", percent: 92.9, longitude: 79, latitude: 22 },
    {
      id: "PAK",
      name: "Pakistan",
      percent: 1.4,
      longitude: 69.3,
      latitude: 30.4,
    },
    {
      id: "USA",
      name: "United States",
      percent: 0.5,
      longitude: -98.6,
      latitude: 39.8,
    },
    {
      id: "BGD",
      name: "Bangladesh",
      percent: 0.5,
      longitude: 90.3,
      latitude: 23.7,
    },
    {
      id: "LKA",
      name: "Sri Lanka",
      percent: 0.4,
      longitude: 80.7,
      latitude: 7.8,
    },
  ],
  cities: [
    {
      id: "chennai",
      name: "Chennai",
      percent: 12.7,
      longitude: 80.2707,
      latitude: 13.0827,
    },
    {
      id: "bangalore",
      name: "Bangalore",
      percent: 12.1,
      longitude: 77.5946,
      latitude: 12.9716,
    },
    {
      id: "delhi",
      name: "Delhi",
      percent: 5.9,
      longitude: 77.209,
      latitude: 28.6139,
    },
    {
      id: "pune",
      name: "Pune",
      percent: 4.9,
      longitude: 73.8567,
      latitude: 18.5204,
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      percent: 4.6,
      longitude: 78.4867,
      latitude: 17.385,
    },
  ],
  ages: [
    { label: "13–17", percent: 4.7 },
    { label: "18–24", percent: 74.1 },
    { label: "25–34", percent: 14.9 },
    { label: "35–44", percent: 3.4 },
    { label: "45–54", percent: 2.3 },
    { label: "55–64", percent: 0.3 },
    { label: "65+", percent: 0.3 },
  ],
  gender: [
    { label: "Women", percent: 27.2 },
    { label: "Men", percent: 72.8 },
  ],
  audienceLanguage: null,
};

export function projectLocation(longitude: number, latitude: number) {
  return {
    x: (longitude + 180) * (1000 / 360),
    y: (85 - latitude) * (1000 / 360),
  };
}
