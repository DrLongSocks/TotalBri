'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MessageCircle, Check } from 'lucide-react';
import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/primitives/Price';
import { Tag } from '@/components/primitives/Tag';
import { QuantityStepper } from './QuantityStepper';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCartStore } from '@/features/cart/store';
import { useCartDrawer } from '@/features/cart/CartDrawerProvider';
import {
  buildProductQuestion,
  buildSingleProductMessage,
} from '@/domain/whatsapp/templates';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { usageNotes } from '@/domain/product/descriptions';
import { env } from '@/lib/env';
import { getSubcategoryName } from '@/domain/category/tree';
import { CATEGORY_META } from '@/domain/category/metadata';

type Props = {
  product: Product;
};

export function ProductInfo({ product }: Props) {
  const t = useTranslations('pdp');
  const locale = useLocale() as Locale;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.add);
  const { openDrawer } = useCartDrawer();
  const category = CATEGORY_META[product.category];
  const subName = getSubcategoryName(product.subcategory)[locale];
  const usage = usageNotes(product.subcategory, product.category);

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openDrawer();
    }, 400);
  };

  const buyUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
    buildSingleProductMessage(product, qty, locale),
  );
  const askUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
    buildProductQuestion(product, locale),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="metadata-line mb-3">
          {category.name[locale]} · {subName}
        </div>
        <h1 className="display-l leading-[1.05]">{product.name[locale]}</h1>
        <div className="mt-4 flex items-center gap-3">
          <Price amount={product.price} compareAt={product.compareAtPrice} locale={locale} size="lg" />
          {!product.inStock ? <Tag tone="sale">{t('outOfStock')}</Tag> : null}
        </div>
      </div>

      <p className="max-w-prose text-base leading-relaxed text-slate">
        {product.description[locale]}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="eyebrow text-slate">{t('quantity')}</span>
          <QuantityStepper value={qty} onChange={setQty} label={t('quantity')} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            {added ? (
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" /> {t('addedToCart')}
              </span>
            ) : (
              t('addToCart')
            )}
          </Button>
          <Button asChild variant="whatsapp" size="lg" className="flex-1">
            <a href={buyUrl} target="_blank" rel="noopener noreferrer">
              {t('buyNow')}
            </a>
          </Button>
        </div>

        <a
          href={askUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 self-start pt-1 text-sm text-slate hover:text-azure"
        >
          <MessageCircle className="h-4 w-4" />
          {t('askQuestion')}
        </a>
      </div>

      <Accordion type="multiple" className="mt-4 w-full">
        <AccordionItem value="description">
          <AccordionTrigger>{t('fullDescription')}</AccordionTrigger>
          <AccordionContent>{product.description[locale]}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="usage">
          <AccordionTrigger>{t('usage')}</AccordionTrigger>
          <AccordionContent>{usage[locale]}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="presentation">
          <AccordionTrigger>{t('presentation')}</AccordionTrigger>
          <AccordionContent>{t('presentationBody')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger>{t('shipping')}</AccordionTrigger>
          <AccordionContent>{t('shippingBody')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
