import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { env } from './env';

export function safeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function productJsonLd(product: Product, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: product.description[locale],
    image: product.images[0] ?? '',
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Total Bri' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MXN',
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${env.NEXT_PUBLIC_SITE_URL}/producto/${product.slug}`,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Total Bri',
    description: 'Fabricación de productos y servicios de limpieza.',
    telephone: '+52 354 688 0969',
    url: env.NEXT_PUBLIC_SITE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calzada San Juan #33, Col. Santa Cecilia',
      addressLocality: 'Los Reyes',
      addressRegion: 'Michoacán',
      addressCountry: 'MX',
    },
    openingHours: 'Mo-Sa 09:00-19:00',
  };
}

export function collectionJsonLd(name: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
  };
}
