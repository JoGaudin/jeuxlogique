import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DailyCompletionProvider } from "@/context/DailyCompletionContext";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jeux de logique du jour",
  description:
    "Mémoire en grille, paires à retrouver, charade et mot d'hier — défis quotidiens pour tablette.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/pwa-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", geistSans.variable)}>
      <body className={`${geistMono.variable} min-h-screen antialiased`}>
        <DailyCompletionProvider>{children}</DailyCompletionProvider>
      </body>
    </html>
  );
}
