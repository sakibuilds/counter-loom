import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Counter-Loom — Steelman & Rebuttal Builder",
  description:
    "Stress-test a claim by weaving the strongest version of the opposing view, then your best rebuttal.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}