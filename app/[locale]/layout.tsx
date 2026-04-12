import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Oswald } from "next/font/google";
import "../globals.css";

import "../../styles/home/reservations.css";
import "../../styles/home/slider.css";
import "../../styles/home/vehicules.css";
import "../../styles/home/services.css";
import "../../styles/home/experience.css";
import "../../styles/home/reviews.css";
import "../../styles/home/footer.css";
import "../../styles/navbar.css";
import "../../styles/style.css";
import "../../styles/language-switcher.css";

import { prisma } from '../../lib/prisma';
import NavbarWrapper from "../components/NavbarWrapper";
import { Footer } from "../components/Footer";
import { SocialButton } from "../components/SocialButton";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { checkExpiredReservations } from "../actions/checkExpiredReservations";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Bouderba Rental Cars",
  description: "Car rental service",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Vérification automatique des réservations expirées
  await checkExpiredReservations();

  // RÉCUPÉRATION : On récupère les voitures ET les lieux en parallèle pour gagner du temps
  const [voitures, locations] = await Promise.all([
    prisma.modeleVoiture.findMany(),
    prisma.location.findMany()
  ]);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <main>{children}</main>
          
          <LanguageSwitcher />
          <SocialButton />
          <Footer />
        </NextIntlClientProvider>

        <script src="https://cdn.jsdelivr.net/npm/flatpickr" defer></script>
      </body>
    </html>
  );
}