import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ROUTES } from "@/content/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://micbask.com"),
  title: ROUTES.home.title,
  description: ROUTES.home.description,
  openGraph: {
    title: ROUTES.home.title,
    description: ROUTES.home.description,
    type: "website",
  },
};

/*
 * Runs before first paint. Exhibits are authored in their finished state, so
 * this is what decides whether they start hidden and build, or simply stand
 * there complete. Anything other than a scripted, motion-tolerant visitor gets
 * the complete version.
 */
const MOTION_GATE = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("motion-ready")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
