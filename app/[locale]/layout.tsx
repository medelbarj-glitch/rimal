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
import HreflangTags from "../components/HreflangTags";
import { Footer } from "../components/Footer";
import { SocialButton } from "../components/SocialButton";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { checkExpiredReservations } from "../actions/checkExpiredReservations";
import { CurrencyProvider } from "../context/CurrencyContext";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import Script from 'next/script';

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
  title: {
    default: "Bouderba Rental Cars | Location de Voiture à Marrakech, Maroc",
    template: "%s | Bouderba Rental Cars - Location Voiture Marrakech",
  },
  description: "Louez une voiture à Marrakech et au Maroc avec Bouderba Rental Cars. Large flotte de véhicules récents, prix compétitifs, livraison aéroport. Réservez en ligne 24h/24.",
  keywords: [
    "location voiture marrakech",
    "location de voiture maroc",
    "rent a car marrakech",
    "car rental marrakech",
    "louer voiture marrakech",
    "location voiture aéroport marrakech",
    "agence location voiture marrakech",
    "voiture de location maroc",
    "car hire morocco",
    "rent car morocco",
    "location pas cher marrakech",
    "Bouderba Rental Cars",
    "location véhicule marrakech",
    "location auto maroc",
  ],
  authors: [{ name: "Bouderba Rental Cars" }],
  creator: "Bouderba Rental Cars",
  publisher: "Bouderba Rental Cars",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["en_US", "es_ES", "ar_MA"],
    siteName: "Bouderba Rental Cars",
    title: "Bouderba Rental Cars | Location de Voiture à Marrakech, Maroc",
    description: "Louez une voiture à Marrakech et au Maroc. Large flotte, prix compétitifs, livraison aéroport Marrakech-Ménara. Réservez en ligne.",
    url: "https://www.bouderba-rental.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bouderba Rental Cars | Location Voiture Marrakech",
    description: "Location de voiture à Marrakech et au Maroc. Prix compétitifs, véhicules récents, livraison aéroport.",
  },
  alternates: {
    canonical: "https://www.bouderba-rental.com",
    languages: {
      "fr": "https://www.bouderba-rental.com/fr",
      "en": "https://www.bouderba-rental.com/en",
      "es": "https://www.bouderba-rental.com/es",
      "ar": "https://www.bouderba-rental.com/ar",
    },
  },
  category: "travel",
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
  const [voitures, locations, settings] = await Promise.all([
    prisma.modeleVoiture.findMany(),
    prisma.location.findMany(),
    prisma.setting.findUnique({ where: { id: 1 } })
  ]);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" precedence="default" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" precedence="default" />
        <HreflangTags />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRental",
              "name": "Bouderba Rental Cars",
              "description": "Location de voiture à Marrakech et au Maroc. Large flotte de véhicules récents à prix compétitifs avec livraison aéroport.",
              "url": "https://www.bouderba-rental.com",
              "telephone": settings?.phoneNumber || "+212 6 67 33 28 34",
              "email": "contact@bouderba-rental.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Marrakech",
                "addressLocality": "Marrakech",
                "addressRegion": "Marrakech-Safi",
                "addressCountry": "MA"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 31.6295,
                "longitude": -7.9811
              },
              "priceRange": "$$",
              "currenciesAccepted": "MAD, EUR",
              "paymentAccepted": "Cash, Credit Card",
              "areaServed": [
                { "@type": "City", "name": "Marrakech" },
                { "@type": "Country", "name": "Morocco" }
              ],
              "sameAs": [
                "https://www.instagram.com/bouderba_rental_cars",
                "https://www.facebook.com/bouderbarentalcars"
              ]
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <main>{children}</main>

            <LanguageSwitcher />
            <SocialButton />
            <Footer />
          </CurrencyProvider>
        </NextIntlClientProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R4PYLVXV0R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R4PYLVXV0R');
          `}
        </Script>

        <Script src="https://cdn.jsdelivr.net/npm/flatpickr" strategy="lazyOnload" />
      </body>
    </html>
  );
}