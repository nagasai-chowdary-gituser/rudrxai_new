import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
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

export const metadata: Metadata = {
  title: "Rudrova Labs | Websites, AI Chatbots, Dashboards & Voice Agents",
  description: "Rudrova Labs builds production-grade websites, AI chatbots, dashboards, voice agents, and custom business platforms. Affordable. Fast. Reliable.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
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
