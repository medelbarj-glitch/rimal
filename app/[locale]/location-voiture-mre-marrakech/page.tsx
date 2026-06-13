import type { Metadata } from 'next';
import Link from 'next/link';
import { carRentalSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schemas';

const META_MRE = {
  title: 'Location Voiture MRE Marrakech – Offres Spéciales Marocains du Monde | Bouderba',
  description: 'Location de voiture à Marrakech pour les MRE. Tarifs préférentiels, livraison à domicile ou aéroport, contrat simple. Profitez de votre séjour au Maroc – Bouderba Car Rental.',
  keywords: 'location voiture MRE marrakech, voiture pour MRE maroc, location voiture marocain monde, rent car mre marrakech, location voiture maroc mre',
  canonical: 'https://www.bouderba-rental.com/fr/location-voiture-mre-marrakech',
};

export const metadata: Metadata = {
  title: META_MRE.title,
  description: META_MRE.description,
  keywords: META_MRE.keywords,
  alternates: { canonical: META_MRE.canonical, languages: { fr: META_MRE.canonical, 'x-default': META_MRE.canonical } },
  openGraph: {
    title: META_MRE.title,
    description: META_MRE.description,
    url: META_MRE.canonical,
    siteName: 'Bouderba Car Rental',
    images: [{ url: '/images/mre-marrakech.jpg', width: 1200, height: 630, alt: 'Location voiture MRE Marrakech – Bouderba' }],
    locale: 'fr_MA',
    type: 'website',
  },
};

const faqs = [
  { question: 'Quels documents faut-il pour louer une voiture en tant que MRE ?', answer: "Il vous faut votre permis de conduire étranger (ou international), votre CNIE ou passeport marocain, et une carte bancaire. Aucun justificatif de résidence marocain n'est exigé." },
  { question: 'Avez-vous des tarifs préférentiels pour les MRE ?', answer: 'Oui, nous proposons des tarifs MRE spéciaux pour les séjours de 7 jours et plus. Contactez-nous directement pour obtenir votre devis personnalisé.' },
  { question: 'Puis-je traverser la frontière avec la voiture louée ?', answer: 'Les véhicules sont autorisés sur tout le territoire marocain. Pour un passage de frontière internationale, merci de nous contacter au préalable.' },
  { question: 'La voiture peut-elle être livrée à mon riad ou hôtel ?', answer: 'Absolument. Nous livrons et récupérons votre véhicule à l'adresse de votre choix à Marrakech et dans les environs, sans supplément.' },
];

const breadcrumbs = [
  { name: 'Accueil', url: 'https://www.bouderba-rental.com/fr' },
  { name: 'Location voiture MRE Marrakech', url: 'https://www.bouderba-rental.com/fr/location-voiture-mre-marrakech' },
];

const mreCarRentalSchema = {
  ...carRentalSchema,
  name: 'Location Voiture MRE Marrakech – Bouderba',
  description: "Offre spéciale location de voiture pour les Marocains Résidant à l'Étranger (MRE) à Marrakech. Tarifs préférentiels, livraison incluse.",
};

export default function MREPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mreCarRentalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <nav aria-label="Fil d'ariane" className="text-sm mb-6 opacity-80">
              <ol className="flex justify-center gap-2">
                <li><Link href="/fr" className="hover:underline">Accueil</Link></li>
                <li aria-hidden>›</li>
                <li aria-current="page">Location voiture MRE</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Location Voiture MRE<br /><span className="text-yellow-300">Marrakech – Offre Spéciale</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Tarifs préférentiels pour les Marocains du Monde · Livraison incluse · Contrat simplifié</p>
            <Link href="/fr#reservation" className="bg-white text-green-800 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-100 transition-colors inline-block">Obtenir mon devis MRE</Link>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos avantages pour les MRE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: '🌍', title: 'Permis étranger accepté', desc: 'Votre permis de conduire européen ou international est valide sans formalité supplémentaire.' },
                { icon: '💶', title: 'Paiement en euros accepté', desc: 'Payez en MAD, EUR ou par carte bancaire internationale. Aucun problème de change.' },
                { icon: '🏠', title: 'Livraison à domicile', desc: 'Livraison à votre riad, hôtel, chez la famille – partout à Marrakech et environs.' },
                { icon: '📅', title: 'Tarifs dégressifs longue durée', desc: 'Plus vous louez longtemps, moins vous payez. Tarifs spéciaux dès 7 jours.' },
                { icon: '🚗', title: 'Flotte récente et entretenue', desc: 'Véhicules récents, climatisés, révisés avant chaque location.' },
                { icon: '📞', title: 'Support WhatsApp bilingue', desc: 'Notre équipe répond en français, arabe et anglais via WhatsApp.' },
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
        <section className="py-16 px-4 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Tarifs spéciaux MRE – Location longue durée</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead><tr className="bg-green-700 text-white"><th className="px-4 py-3 rounded-tl-lg">Durée</th><th className="px-4 py-3">Citadine</th><th className="px-4 py-3">SUV</th><th className="px-4 py-3 rounded-tr-lg">Inclus</th></tr></thead>
                <tbody>
                  {[
                    { dur: '1–6 jours', cit: '150 MAD/j', suv: '300 MAD/j', inc: 'Assurance, GPS' },
                    { dur: '7–14 jours', cit: '130 MAD/j', suv: '260 MAD/j', inc: 'Assurance, GPS, Livraison' },
                    { dur: '15–30 jours', cit: '110 MAD/j', suv: '220 MAD/j', inc: 'Assurance, GPS, Livraison + Reprise' },
                    { dur: '+ 30 jours', cit: 'Sur devis', suv: 'Sur devis', inc: 'Package complet personnalisé' },
                  ].map((row, i) => (
                    <tr key={row.dur} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{row.dur}</td>
                      <td className="px-4 py-3 text-green-700 font-bold">{row.cit}</td>
                      <td className="px-4 py-3 text-green-700 font-bold">{row.suv}</td>
                      <td className="px-4 py-3 text-gray-600">{row.inc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Questions fréquentes – MRE & location de voiture Marrakech</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="bg-gray-50 rounded-xl p-6 group">
                  <summary className="font-semibold text-lg text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {faq.question}<span className="text-green-700 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-green-700 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Louez votre voiture à Marrakech en toute simplicité</h2>
            <p className="text-xl mb-8 opacity-90">Contrat clair, tarifs fixes, assistance garantie. Profitez pleinement de votre séjour au Maroc.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fr#reservation" className="bg-white text-green-800 font-bold px-8 py-4 rounded-full hover:bg-yellow-100 transition-colors">Réserver maintenant</Link>
              <a href="https://wa.me/212600000000" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-green-800 transition-colors">WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
