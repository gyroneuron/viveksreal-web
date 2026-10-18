// Display derivatives remove only confirmed padding. Original files remain intact.
// ProPeers includes a stacked split-screen: its taller active canvas is deliberate.
export type MediaPresentation = {
  width: number;
  height: number;
  poster: string;
  video?: string;
};
export const mediaPresentation: Record<string, MediaPresentation> = {
  propeers: {
    width: 720,
    height: 860,
    poster: "/media/display/propeers.jpg",
    video: "/media/display/propeers.mp4",
  },
  "hive-school": {
    width: 720,
    height: 408,
    poster: "/media/display/hive-school.jpg",
    video: "/media/display/hive-school.mp4",
  },
  dailyobjects: {
    width: 720,
    height: 408,
    poster: "/media/display/dailyobjects.jpg",
    video: "/media/display/dailyobjects.mp4",
  },
  "founder-circle": {
    width: 1276,
    height: 718,
    poster: "/media/display/founder-circle.jpg",
    video: "/media/founder-circle.mp4",
  },
  "intro-story": {
    width: 640,
    height: 420,
    poster: "/media/display/intro-story.jpg",
  },
  "internship-roadmap": {
    width: 640,
    height: 364,
    poster: "/media/display/internship-roadmap.jpg",
  },
};
