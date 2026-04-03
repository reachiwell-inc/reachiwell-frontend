import type { Metadata } from "next";
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/onest/600.css";
import "./globals.css";
import ConditionalFooter from "@/components/ConditionalFooter";

export const metadata: Metadata = {
  title: "ReachiWell - Your AI Health Guide",
  description: "Get triaged, find care, and arrange transport in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
