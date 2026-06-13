export const carRentalSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'Bouderba Car Rental',
  description: 'Location de voiture à Marrakech – tarifs compétitifs, flotte récente, livraison disponible.',
  url: 'https://www.bouderba-rental.com',
  telephone: '+212600000000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Marrakech',
    addressLocality: 'Marrakech',
    addressCountry: 'MA',
  },
  openingHours: 'Mo-Su 07:00-22:00',
  priceRange: '150-500 MAD/jour',
  currenciesAccepted: 'MAD, EUR',
  paymentAccepted: 'Cash, Credit Card',
  areaServed: { '@type': 'City', name: 'Marrakech' },
};

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
