import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TRIport by Helix",
    default: "TRIport by Helix — Request-Based 3D Printing",
  },
  description:
    "TRIport is a request-based distributed manufacturing platform. Browse 3D-printed products and submit print requests — fulfilled by Helix members.",
  keywords: [
    "3D printing",
    "custom manufacturing",
    "Helix",
    "TRIport",
    "request-based",
    "distributed manufacturing",
  ],
  openGraph: {
    title: "TRIport by Helix",
    description: "Manufacturing. On Request. Browse and request precision 3D-printed parts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <SplashScreen />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
