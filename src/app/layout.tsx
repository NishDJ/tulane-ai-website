import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { PerformanceProvider } from "@/components/providers/performance-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LiveAnnouncerProvider } from "@/components/accessibility";
import { SkipLinks } from "@/components/accessibility";
import { ErrorBoundary, OfflineDetector } from "@/components/error";
import { CookieConsent } from "@/components/privacy/cookie-consent";
import { generateMetadata, generateOrganizationStructuredData } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tulane.ai'),
  ...generateMetadata({
    title: "Tulane AI & Data Science Division",
    description: "Advancing medical research through artificial intelligence and data science at Tulane University School of Medicine",
    url: "/",
    type: "website",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          defaultContrastMode="normal"
          storageKey="tulane-ai-theme"
        >
          <LiveAnnouncerProvider>
            <PerformanceProvider>
              <ErrorBoundary>
                <SkipLinks />
                <div className="relative flex min-h-screen flex-col">
                  <Header id="navigation" />
                  <main id="main-content" className="flex-1" tabIndex={-1}>
                    {children}
                  </main>
                  <Footer id="footer" />
                </div>
                <OfflineDetector />
                <CookieConsent />
              </ErrorBoundary>
            </PerformanceProvider>
          </LiveAnnouncerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
