import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import { Sora } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const THEME_STORAGE_KEY = "netatlas-theme";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "NetAtlas",
  description: "Network Discovery & Monitoring Platform",
};

/** Script bloqueante que aplica o tema antes da hidratação (evita flash e mismatch visual). */
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var resolved = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", resolved === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${sora.className} flex min-h-full flex-col`}>
        <Script
          id="netatlas-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
