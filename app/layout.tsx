import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./motion.css";
import { ReelPlaybackProvider } from "./components/reel-playback";
import { MotionDirector } from "./components/motion-director";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "400 500",
  variable: "--font-body",
  display: "swap",
});
const space = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  weight: "500 600",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vivek Jaglan — Creator + Software Engineer",
  description:
    "Practical tech, career, and startup content for young builders in India. Explore Vivek Jaglan’s collaborations and start a conversation about your product.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Viveksreal — Useful ideas, beautifully told.",
    description:
      "Creator-led product stories with a software engineer’s understanding. Technology, careers, and the next generation of builders.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body>
        <ReelPlaybackProvider>{children}</ReelPlaybackProvider>
        <MotionDirector />
      </body>
    </html>
  );
}
