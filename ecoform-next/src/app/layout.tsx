import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ecoform | Eco-Friendly Paper Cups",
  description:
    "Premium eco-friendly paper cups crafted for businesses that value sustainability without compromising quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
