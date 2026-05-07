import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "DermaLens - AI-Powered Skin Lesion Analysis",
  description:
    "Upload dermoscopic images and receive AI-powered classification with explainable results using Grad-CAM visualization.",
  keywords: [
    "skin cancer detection",
    "dermoscopy",
    "AI diagnosis",
    "explainable AI",
    "Grad-CAM",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
