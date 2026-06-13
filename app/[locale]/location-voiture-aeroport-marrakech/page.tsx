import type { Metadata } from 'next';
import Link from 'next/link';
import { carRentalSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schemas';

const META_AIRPORT = {
  title: 'Location Voiture Aéroport Marrakech Menara – Livraison Immédiate | Bouderba',
  description: "Louez une voiture à l'aéroport Marrakech Menara (RAK). Livraison sur place, sans attente, à partir de 150 MAD/jour. Réservez en ligne – Bouderba Car Rental.",
  keywords: 'location voiture aéroport marrakech, location voiture menara, rent car marrakech airport, voiture aeroport marrakech, location voiture rak',
  canonical: 'https://www.bouderba-rental.com/fr/location-voiture-aeroport-marrakech',
};

export const metadata: Metadata = {
  title: META_AIRPORT.title,
  description: META_AIRPORT.description,
  keywords: META_AIRPORT.keywords,
  alternates: {
    canonical: META_AIRPORT.canonical,
    languages: {
      fr: 'https://www.bouderba-rental.com/fr/location-voiture-aeroport-marrakech',
      en: 'https://www.bouderba-rental.com/en/car-rental-marrakech-airport',
      'x-default': 'https://www.bouderba-rental.com/fr/location-voiture-aeroport-marrakech',
    },
  },
  openGraph: {
    title: META_AIRPORT.title,
    description: META_AIRPORT.description,
    url: META_AIRPORT.canonical,
    siteName: 'Bouderba Car Rental',
    images: [{ url: '/images/aeroport-marrakech-menara.jpg', width: 1200, height: 630, alt: 'Location voiture aéroport Marrakech Menara – Bouderba' }],
    locale: 'fr_MA',
    type: 'website',
  },
};

const faqs = [
  { question: "Puis-je récupérer ma voiture directement à l'aéroport Menara ?", answer: "Oui. Notre équipe vous attend à l'arrivée des vols à l'aéroport Marrakech Menara (RAK) avec votre véhicule prêt. Aucune attente supplémentaire." },
  { question: "Quel est le tarif minimum pour une location à l'aéroport de Marrakech ?", answer: 'Nos tarifs commencent à partir de 150 MAD/jour (environ 14 €) pour une citadine. Le prix varie selon le modèle choisi et la durée de location.' },
  { question: 'Faut-il un dépôt de garantie pour louer une voiture à Marrakech ?', answer: 'Un dépôt de garantie est demandé par carte bancaire (non débité). Le montant varie entre 2 000 et 5 000 MAD selon le véhicule.' },
  { question: "La livraison à l'aéroport est-elle incluse dans le prix ?", answer: "Oui, la livraison et la récupération à l'aéroport Marrakech Menara sont incluses dans nos tarifs sans frais supplémentaires." },
];

const breadcrumbs = [
  { name: 'Accueil', url: 'https://www.bouderba-rental.com/fr' },
  { name: 'Location voiture aéroport Marrakech', url: 'https://www.bouderba-rental.com/fr/location-voiture-aeroport-marrakech' },
];

const airportCarRentalSchema = {
  ...carRentalSchema,
  name: 'Location Voiture Aéroport Marrakech Menara – Bouderba',
  description: "Service de location de voiture avec livraison à l'aéroport international de Marrakech Menara (RAK). Disponible 7j/7, 7h-22h.",
  areaServed: { '@type': 'Place', name: 'Aéroport Marrakech Menara (RAK)', address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' } },
};

export default function AirportPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(airportCarRentalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <nav aria-label="Fil d'ariane" className="text-sm mb-6 opacity-80">
              <ol className="flex justify-center gap-2">
                <li><Link href="/fr" className="hover:underline">Accueil</Link></li>
                <li aria-hidden>›</li>
                <li aria-current="page">Aéroport Marrakech</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Location Voiture<br /><span className="text-yellow-300">Aéroport Marrakech Menara</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Livraison immédiate à l&apos;arrivée · À partir de 150 MAD/jour · 7j/7
            </p>
            <Link href="/fr#reservation" className="bg-white text-orange-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-100 transition-colors inline-block">
              Réserver maintenant
            </Link>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Pourquoi choisir Bouderba à l&apos;aéroport ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '✈️', title: 'Livraison sur le tarmac', desc: "Votre voiture vous attend à la sortie des arrivées, panneau à votre nom." },
                { icon: '💰', title: 'Meilleur prix garanti', desc: 'À partir de 150 MAD/jour, sans frais cachés. Tarifs fixes, sans surprise.' },
                { icon: '📱', title: 'Réservation en ligne 24h/24', desc: "Réservez à l'avance depuis votre téléphone. Confirmation immédiate par WhatsApp." },
                { icon: '🔒', title: 'Assurance tous risques incluse', desc: "Tous nos véhicules sont couverts tous risques. Partez l'esprit tranquille." },
                { icon: '🗺️', title: 'GPS offert', desc: 'Navigation GPS gratuite sur tous nos véhicules pour explorer le Maroc.' },
                { icon: '📞', title: 'Assistance 7j/7', desc: 'Une équipe disponible par téléphone et WhatsApp toute la journée.' },
              ].map((item) => (
                <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-orange-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Comment récupérer votre voiture à l&apos;aéroport ?</h2>
            <ol className="space-y-6">
              {[
                { step: '1', title: 'Réservez en ligne', desc: 'Choisissez votre véhicule, vos dates et renseignez votre numéro de vol.' },
                { step: '2', title: 'Confirmation instantanée', desc: 'Vous recevez une confirmation par email et WhatsApp avec les détails de récupération.' },
                { step: '3', title: 'Atterrissage à Marrakech Menara', desc: "Notre agent vous attend à la sortie des arrivées avec un panneau à votre nom." },
                { step: '4', title: 'Signature du contrat et départ', desc: 'Signez le contrat en 5 minutes, récupérez les clés et prenez la route !' },
              ].map((item) => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{item.step}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos tarifs – Location aéroport Marrakech</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="px-4 py-3 rounded-tl-lg">Catégorie</th>
                    <th className="px-4 py-3">Modèle exemple</th>
                    <th className="px-4 py-3">Prix / jour</th>
                    <th className="px-4 py-3 rounded-tr-lg">Inclus</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Citadine', model: 'Dacia Sandero', price: '150 MAD', inc: 'Assurance, GPS' },
                    { cat: 'Berline', model: 'Dacia Logan', price: '200 MAD', inc: 'Assurance, GPS' },
                    { cat: 'SUV', model: 'Dacia Duster', price: '300 MAD', inc: 'Assurance, GPS, Siège bébé' },
                    { cat: 'Premium', model: 'Volkswagen Tiguan', price: '500 MAD', inc: 'Assurance tous risques, GPS' },
                  ].map((row, i) => (
                    <tr key={row.cat} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{row.cat}</td>
                      <td className="px-4 py-3">{row.model}</td>
                      <td className="px-4 py-3 text-orange-600 font-bold">À partir de {row.price}</td>
                      <td className="px-4 py-3 text-gray-600">{row.inc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center mt-4 text-gray-500 text-sm">* Tarifs indicatifs. Prix final confirmé à la réservation selon disponibilité.</p>
          </div>
        </section>
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Questions fréquentes – Location voiture aéroport Marrakech</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="bg-white rounded-xl p-6 shadow-sm group">
                  <summary className="font-semibold text-lg text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-orange-600 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-orange-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt à louer votre voiture à l&apos;aéroport de Marrakech ?</h2>
            <p className="text-xl mb-8 opacity-90">Réservez maintenant et profitez d&apos;une livraison immédiate à votre arrivée.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fr#reservation" className="bg-white text-orange-700 font-bold px-8 py-4 rounded-full hover:bg-yellow-100 transition-colors">Réserver en ligne</Link>
              <a href="https://wa.me/212600000000" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-orange-700 transition-colors">WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
