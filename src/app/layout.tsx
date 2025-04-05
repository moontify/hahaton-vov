import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppContextProvider from "@/contexts/AppContext";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PageTransition from "@/components/ui/PageTransition";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL('https://vov-project.ru'),
  title: {
    default: "Великая Отечественная Война - Помним и гордимся",
    template: "%s | Великая Отечественная Война"
  },
  description: "Интерактивный портал посвященный истории Великой Отечественной Войны, героям и важным событиям",
  keywords: ["ВОВ", "Великая Отечественная Война", "История", "Герои", "9 мая", "День Победы"],
  authors: [{ name: 'Команда проекта "Помним и гордимся"' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://vov-project.ru',
    title: 'Великая Отечественная Война - Помним и гордимся',
    description: 'Интерактивный портал посвященный истории Великой Отечественной Войны',
    siteName: 'Помним и гордимся',
    images: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5cQoi2JLp5o5k0tsvIgXE0M5cHrSNiJ-RQ&s',
        width: 1200,
        height: 630,
        alt: 'Великая Отечественная Война',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Великая Отечественная Война - Помним и гордимся',
    description: 'Интерактивный портал посвященный истории Великой Отечественной Войны',
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5cQoi2JLp5o5k0tsvIgXE0M5cHrSNiJ-RQ&s'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gradient`}
      >
        <div className="noise-overlay"></div>
        <AppContextProvider>
          <Header />
          <main className="flex-1 relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </AppContextProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
