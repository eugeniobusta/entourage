import type { Metadata } from "next";
import { Barlow_Condensed, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displayFont = Barlow_Condensed({
  variable: "--font-display-google",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const serifFont = Playfair_Display({
  variable: "--font-serif-google",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body-google",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "ENTOURAGE — Contemporary Luxury",
  description:
    "A collective built around the individual. Built on art, culture, and design — for anyone pursuing something bigger than themselves.",
  openGraph: {
    title: "ENTOURAGE",
    description: "A collective built around the individual.",
    siteName: "ENTOURAGE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENTOURAGE",
    description: "A collective built around the individual.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${serifFont.variable} ${bodyFont.variable}`}
    >
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
