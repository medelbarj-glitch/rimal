import type { Metadata } from 'next';
import Link from 'next/link';
import { carRentalSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schemas';

const META_PAS_CHER = {
  title: 'Location Voiture Pas Cher Marrakech – À partir de 150 MAD/jour | Bouderba',
  description: 'Louez une voiture pas chère à Marrakech dès 150 MAD/jour (14 €). Assurance incluse, livraison gratuite, flotte récente. Réservez en ligne – Bouderba Car Rental.',
  keywords: 'location voiture pas cher marrakech, voiture bon marché marrakech, location voiture marrakech prix, louer voiture marrakech pas cher, rent car cheap marrakech',
  canonical: 'https://www.bouderba-rental.com/fr/location-voiture-pas-cher-marrakech',
};

export const metadata: Metadata = {
  title: META_PAS_CHER.title,
  description: META_PAS_CHER.description,
  keywords: META_PAS_CHER.keywords,
  alternates: { canonical: META_PAS_CHER.canonical, languages: { fr: META_PAS_CHER.canonical, 'x-default': META_PAS_CHER.canonical } },
  openGraph: {
    title: META_PAS_CHER.title,
    description: META_PAS_CHER.description,
    url: META_PAS_CHER.canonical,
    siteName: 'Bouderba Car Rental',
    images: [{ url: '/images/location-pas-cher-marrakech.jpg', width: 1200, height: 630, alt: 'Location voiture pas cher Marrakech – Bouderba' }],
    locale: 'fr_MA',
    type: 'website',
  },
};

const prixTable = [
  { cat: 'Citadine', model: 'Dacia Sandero', price1j: '150 MAD', price7j: '130 MAD', price30j: '110 MAD' },
  { cat: 'Compacte', model: 'Dacia Logan', price1j: '200 MAD', price7j: '170 MAD', price30j: '140 MAD' },
  { cat: 'SUV compact', model: 'Dacia Duster', price1j: '300 MAD', price7j: '260 MAD', price30j: '220 MAD' },
  { cat: 'Monospace', model: 'Dacia Lodgy', price1j: '350 MAD', price7j: '300 MAD', price30j: '260 MAD' },
  { cat: 'Premium', model: 'VW Tiguan', price1j: '500 MAD', price7j: '430 MAD', price30j: '380 MAD' },
];

const faqs = [
  { question: 'Quel est le prix minimum pour louer une voiture à Marrakech ?', answer: "Chez Bouderba, nos tarifs commencent à 150 MAD/jour (~14 €) pour une citadine type Dacia Sandero, assurance et GPS inclus. C'est l'un des meilleurs prix du marché à Marrakech." },
  { question: 'Y a-t-il des frais cachés dans vos tarifs ?', answer: "Non. Nos prix incluent l'assurance, le GPS et la livraison à Marrakech. Aucuns frais supplémentaires au retour, sauf dommages constatés." },
  { question: 'Comment obtenir le meilleur prix pour ma location à Marrakech ?', answer: "Réservez à l'avance (au moins 48h) et choisissez une durée de 7 jours ou plus pour bénéficier de nos tarifs dégressifs. Nous proposons aussi des offres saisonnières." },
  { question: 'La livraison est-elle vraiment gratuite ?', answer: "Oui, la livraison et la reprise sont incluses dans nos tarifs pour toute location à Marrakech-ville et l'aéroport Menara. Des frais peuvent s'appliquer hors Marrakech." },
];

const breadcrumbs = [
  { name: 'Accueil', url: 'https://www.bouderba-rental.com/fr' },
  { name: 'Location voiture pas cher Marrakech', url: META_PAS_CHER.canonical },
];

const cheapCarRentalSchema = {
  ...carRentalSchema,
  name: 'Location Voiture Pas Cher Marrakech – Bouderba',
  description: 'Location de voiture à Marrakech au meilleur prix garanti. À partir de 150 MAD/jour, assurance et GPS inclus.',
  offers: { '@type': 'Offer', price: '150', priceCurrency: 'MAD', availability: 'https://schema.org/InStock', priceValidUntil: '2025-12-31' },
};

export default function PasCherPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cheapCarRentalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <nav aria-label="Fil d'ariane" className="text-sm mb-6 opacity-80">
              <ol className="flex justify-center gap-2">
                <li><Link href="/fr" className="hover:underline">Accueil</Link></li>
                <li aria-hidden>›</li>
                <li aria-current="page">Location pas cher Marrakech</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Location Voiture Pas Cher<br /><span className="text-yellow-300">Marrakech – À partir de 150 MAD/jour</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Assurance incluse · GPS offert · Livraison gratuite · Sans frais cachés</p>
            <Link href="/fr#reservation" className="bg-white text-blue-800 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-100 transition-colors inline-block">Voir les offres</Link>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Grille tarifaire – Location voiture Marrakech</h2>
            <p className="text-center text-gray-500 mb-10">Prix par jour selon la durée de location. Assurance et GPS inclus.</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead><tr className="bg-blue-700 text-white"><th className="px-4 py-3 rounded-tl-lg">Catégorie</th><th className="px-4 py-3">Modèle</th><th className="px-4 py-3">1–6 jours</th><th className="px-4 py-3">7–29 jours</th><th className="px-4 py-3 rounded-tr-lg">30+ jours</th></tr></thead>
                <tbody>
                  {prixTable.map((row, i) => (
                    <tr key={row.cat} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{row.cat}</td>
                      <td className="px-4 py-3">{row.model}</td>
                      <td className="px-4 py-3 text-blue-700 font-bold">{row.price1j}</td>
                      <td className="px-4 py-3 text-blue-700 font-bold">{row.price7j}</td>
                      <td className="px-4 py-3 text-blue-700 font-bold">{row.price30j}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Tout est inclus dans nos prix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: '✅', label: 'Assurance tous risques' },
                { icon: '✅', label: 'GPS / Navigation inclus' },
                { icon: '✅', label: 'Kilométrage illimité' },
                { icon: '✅', label: "Livraison à Marrakech et aéroport" },
                { icon: '✅', label: 'Assistance routière 24h/24' },
                { icon: '✅', label: 'Contrat clair sans surprise' },
                { icon: '❌', label: 'Frais de carburant (à votre charge)' },
                { icon: '❌', label: 'Amendes de stationnement' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Questions fréquentes – Location pas chère Marrakech</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="bg-gray-50 rounded-xl p-6 group">
                  <summary className="font-semibold text-lg text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {faq.question}<span className="text-blue-700 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-blue-700 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">La location de voiture pas chère à Marrakech, c'est ici</h2>
            <p className="text-xl mb-8 opacity-90">Meilleur rapport qualité/prix garanti. Réservez en ligne, c'est rapide et gratuit.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fr#reservation" className="bg-white text-blue-800 font-bold px-8 py-4 rounded-full hover:bg-yellow-100 transition-colors">Réserver maintenant</Link>
              <a href="https://wa.me/212600000000" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-blue-800 transition-colors">WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
