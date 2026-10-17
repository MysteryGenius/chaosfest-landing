import type { Metadata } from "next";
import { Averia_Serif_Libre, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const averiaSerifLibre = Averia_Serif_Libre({
  variable: "--font-averia-serif-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Chaosfest",
  description:
    "Bringing chaos to South East Asian Table Top Role Playing Games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${averiaSerifLibre.variable} h-full antialiased`}
    >
      <body className="bg-[#7a302f]">
        {children}
      </body>
    </html>
  );
}
