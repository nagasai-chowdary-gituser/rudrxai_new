import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const headingFont = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const description =
  "Rudrova Labs builds production-grade websites, AI chatbots, dashboards, voice agents, and custom business platforms. Affordable. Fast. Reliable.";

export const metadata: Metadata = {
  // Without metadataBase, Next cannot resolve relative OG/canonical URLs and
  // shared links render without a preview card.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Websites, AI Chatbots, Dashboards & Voice Agents`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Websites, AI Chatbots, Dashboards & Voice Agents`,
    description,
    url: SITE_URL,
    images: [{ url: "/logo.jpeg", width: 1200, height: 1200, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Websites, AI Chatbots, Dashboards & Voice Agents`,
    description,
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    // logo.png is JPEG data with a .png name, so declare the real type.
    icon: [{ url: "/logo.jpeg", type: "image/jpeg" }],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} ${headingFont.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {/* Sections animate in via framer-motion, which server-renders at
            opacity:0. Without this the page is blank when JS is unavailable. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
