import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StepUp",
  description: "Shoe store management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}