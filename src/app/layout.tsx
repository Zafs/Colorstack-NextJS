import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ColorStack – Color-layered 3D printing generator",
  description: "Turn any image into a multi-color 3D print with this free, browser-based tool. The best alternative to HueForge for creating stunning color-layered STL files.",
  keywords: "3D printing, color printing, STL files, HueForge alternative, multi-color prints, 3D modeling, color layers, filament colors, 3D print design, free 3D printing tool, browser-based 3D modeling, image to STL converter",
  authors: [{ name: "ColorStack" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    type: "website",
    title: "ColorStack - Free HueForge Alternative for Color-Layered 3D Printing",
    description: "Transform any image into beautiful multi-color 3D prints with ColorStack. Free, browser-based tool for creating color-layered STL files.",
    url: "/",
    siteName: "ColorStack",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorStack - Free HueForge Alternative for Color-Layered 3D Printing",
    description: "Transform any image into beautiful multi-color 3D prints with ColorStack. Free, browser-based tool for creating color-layered STL files.",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366F1",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#4f46e5', // Our indigo-600 for buttons and highlights
          colorBackground: '#1f2937', // A dark gray matching our cards
          borderRadius: '0.375rem', // Matches Tailwind's 'rounded-md'
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
