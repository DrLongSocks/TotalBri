import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getAllProducts } from '@/domain/product/repository';
import { CategoryEnum } from '@/domain/product/schema';
import { LOCALES } from '@/domain/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const products = getAllProducts();

  const urls: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const prefix = locale === 'es' ? '' : '/en';
    urls.push(
      { url: `${base}${prefix || '/'}`, changeFrequency: 'weekly', priority: 1 },
      { url: `${base}${prefix}/tienda`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}${prefix}/mayoreo`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${base}${prefix}/nosotros`, changeFrequency: 'monthly', priority: 0.5 },
    );

    for (const category of CategoryEnum.options) {
      urls.push({
        url: `${base}${prefix}/tienda/${category}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const p of products) {
      urls.push({
        url: `${base}${prefix}/producto/${p.slug}`,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
