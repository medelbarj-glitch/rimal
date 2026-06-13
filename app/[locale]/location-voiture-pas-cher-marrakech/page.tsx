import type { Metadata } from 'next';
import Link from 'next/link';
import { carRentalSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schemas';

const META_PAS_CHER = {
  title: 'Location Voiture Pas Cher Marrakech – Tarifs Dès 150 MAD/Jour | Bouderba',
  description: "Louez une voiture pas chère à Marrakech dès 150 MAD/jour. Flotte récente, assurance incluse, livraison disponible. Meilleur prix garanti – Bouderba Car Rental.",
  keywords: 'location voiture pas cher marrakech, voiture moins cher marrakech, location voiture économique marrakech, louer voiture marrakech prix',
  canonical: 'https://www.bouderba-rental.com/fr/location-voiture-pas-cher-marrakech',
};

export const metadata: Metadata = {
  title: META_PAS_CHER.title,
  description: META_PAS_CHER.description,
  keywords: META_PAS_CHER.keywords,
  alternates: {
    canonical: META_PAS_CHER.canonical,
    languages: { fr: META_PAS_CHER.canonical, 'x-default': META_PAS_CHER.canonical },
  },
  openGraph: {
    title: META_PAS_CHER.title,
    description: META_PAS_CHER.description,
    url: META_PAS_CHER.canonical,
    siteName: 'Bouderba Car Rental',
    images: [{ url: '/images/location-voiture-pas-cher-marrakech.jpg', width: 1200, height: 630, alt: 'Location voiture pas cher Marrakech – Bouderba' }],
    locale: 'fr_MA',
    type: 'website',
  },
};

const faqs = [
  { question: 'Quel est le prix minimum pour louer une voiture à Marrakech ?', answer: "Notre tarif le plus bas commence à 150 MAD/jour (environ 14 €) pour une citadine Dacia Sandero. Les prix varient selon la durée et le modèle choisi." },
  { question: "Y a-t-il des frais cachés dans vos tarifs ?", answer: "Non. Nos tarifs incluent l'assurance et le GPS. Le seul coût supplémentaire éventuel est le dépôt de garantie (non débité) par carte bancaire." },
  { question: "Comment obtenir le meilleur prix pour ma location ?", answer: "Réservez à l'avance et optez pour une durée plus longue. Nos tarifs sont dégressifs : plus vous louez longtemps, moins vous payez par jour." },
  { question: "Puis-je payer en espèces ou par carte ?", answer: "Nous acceptons les espèces (MAD et EUR) ainsi que les cartes bancaires internationales (Visa, Mastercard). Le dépôt de garantie est requis par carte." },
];

const breadcrumbs = [
  { name: 'Accueil', url: 'https://www.bouderba-rental.com/fr' },
  { name: 'Location voiture pas cher Marrakech', url: META_PAS_CHER.canonical },
];

const pasSchema = {
  ...carRentalSchema,
  name: 'Location Voiture Pas Cher Marrakech – Bouderba',
  description: "Location de voiture économique à Marrakech. Tarifs dès 150 MAD/jour, assurance incluse, flotte récente.",
};

export default function PasCherPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pasSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <nav aria-label="Fil d'ariane" className="text-sm mb-6 opacity-80">
              <ol className="flex justify-center gap-2">
                <li><Link href="/fr" className="hover:underline">Accueil</Link></li>
                <li aria-hidden>›</li>
                <li aria-current="page">Location voiture pas cher</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Location Voiture<br /><span className="text-yellow-300">Pas Cher à Marrakech</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Dès 150 MAD/jour · Assurance incluse · Livraison disponible · 7j/7
            </p>
            <Link href="/fr#reservation" className="bg-white text-blue-800 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-100 transition-colors inline-block">
              Voir les tarifs
            </Link>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos tarifs – Location voiture économique Marrakech</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 rounded-tl-lg">Catégorie</th>
                    <th className="px-4 py-3">Modèle</th>
                    <th className="px-4 py-3">1–3 jours</th>
                    <th className="px-4 py-3">7+ jours</th>
                    <th className="px-4 py-3 rounded-tr-lg">Inclus</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Citadine', model: 'Dacia Sandero', short: '150 MAD/j', long: '120 MAD/j', inc: 'Assurance, GPS' },
                    { cat: 'Berline', model: 'Dacia Logan', short: '200 MAD/j', long: '160 MAD/j', inc: 'Assurance, GPS' },
                    { cat: 'SUV compact', model: 'Dacia Duster', short: '300 MAD/j', long: '240 MAD/j', inc: 'Assurance, GPS, Siège bébé' },
                    { cat: 'SUV familial', model: 'Renault Kadjar', short: '380 MAD/j', long: '300 MAD/j', inc: 'Assurance tous risques, GPS' },
                    { cat: 'Premium', model: 'Volkswagen Tiguan', short: '500 MAD/j', long: '420 MAD/j', inc: 'Assurance tous risques, GPS' },
                  ].map((row, i) => (
                    <tr key={row.cat} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{row.cat}</td>
                      <td className="px-4 py-3">{row.model}</td>
                      <td className="px-4 py-3 text-blue-700 font-bold">{row.short}</td>
                      <td className="px-4 py-3 text-green-700 font-bold">{row.long}</td>
                      <td className="px-4 py-3 text-gray-600">{row.inc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center mt-4 text-gray-500 text-sm">* Tarifs indicatifs TTC. Prix final confirmé à la réservation.</p>
          </div>
        </section>
        <section className="py-16 px-4 bg-blue-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Ce qui est inclus dans nos tarifs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-700 mb-4">✅ Inclus</h3>
                <ul className="space-y-2 text-gray-700">
                  {['Assurance responsabilité civile', 'GPS intégré ou application', 'Kilométrage illimité', 'Assistance routière 24h/24', 'Véhicule climatisé et révisé'].map(item => (
                    <li key={item} className="flex items-center gap-2"><span className="text-green-500">✓</span> {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-600 mb-4">❌ Non inclus</h3>
                <ul className="space-y-2 text-gray-700">
                  {['Carburant (plein à rendre)', 'Dépôt de garantie (restitué)', 'Supplément jeune conducteur (-25 ans)', 'Livraison hors Marrakech (sur devis)'].map(item => (
                    <li key={item} className="flex items-center gap-2"><span className="text-red-400">✗</span> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Questions fréquentes – Location voiture pas cher Marrakech</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="bg-gray-50 rounded-xl p-6 group">
                  <summary className="font-semibold text-lg text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-blue-700 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-blue-700 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Réservez votre voiture pas chère maintenant</h2>
            <p className="text-xl mb-8 opacity-90">Meilleur prix garanti. Assurance incluse. Pas de frais cachés.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fr#reservation" className="bg-white text-blue-800 font-bold px-8 py-4 rounded-full hover:bg-yellow-100 transition-colors">Réserver en ligne</Link>
              <a href="https://wa.me/212600000000" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-blue-800 transition-colors">WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
