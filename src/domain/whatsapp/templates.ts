import type { Locale } from '../i18n/config';
import { formatPrice } from '../i18n/format';
import type { Product } from '../product/schema';
import type { HydratedLine } from '../cart/totals';

const TRUNCATE_THRESHOLD = 1800;

export type BulkInquiry = {
  name: string;
  businessName: string;
  volume: string;
  categories: string[];
  notes?: string;
};

function line(quantity: number, name: string, price: number, locale: Locale): string {
  return `${quantity}× ${name} — ${formatPrice(price * quantity, locale)}`;
}

export function buildOrderMessage(
  lines: HydratedLine[],
  subtotal: number,
  locale: Locale,
): string {
  const inStockLines = lines.filter(({ product }) => product.inStock);
  const phrases =
    locale === 'es'
      ? {
          greeting: '¡Hola Total Bri! Quiero hacer un pedido:',
          subtotal: 'Subtotal',
          confirm: 'Por favor, ¿me pueden confirmar disponibilidad y costo de envío?',
          name: 'Mi nombre:',
          address: 'Dirección:',
          payment: 'Forma de pago preferida:',
          more: (n: number) => `…y ${n} productos más`,
        }
      : {
          greeting: 'Hi Total Bri! I would like to place an order:',
          subtotal: 'Subtotal',
          confirm: 'Could you please confirm availability and shipping cost?',
          name: 'My name:',
          address: 'Address:',
          payment: 'Preferred payment method:',
          more: (n: number) => `…and ${n} more products`,
        };

  const rendered = inStockLines.map(({ line: l, product }) =>
    line(l.quantity, product.name[locale], product.price, locale),
  );

  const buildMessage = (items: string[], remaining = 0): string => {
    const itemBlock = items.join('\n');
    const tail = remaining > 0 ? `\n${phrases.more(remaining)}` : '';
    return [
      phrases.greeting,
      '',
      itemBlock + tail,
      '',
      `${phrases.subtotal}: ${formatPrice(subtotal, locale)} MXN`,
      phrases.confirm,
      phrases.name,
      phrases.address,
      phrases.payment,
    ].join('\n');
  };

  let msg = buildMessage(rendered);
  if (encodeURIComponent(msg).length <= TRUNCATE_THRESHOLD) return msg;

  let take = rendered.length;
  while (take > 1) {
    take -= 1;
    msg = buildMessage(rendered.slice(0, take), rendered.length - take);
    if (encodeURIComponent(msg).length <= TRUNCATE_THRESHOLD) return msg;
  }
  return msg;
}

export function buildSingleProductMessage(
  product: Product,
  quantity: number,
  locale: Locale,
): string {
  if (locale === 'es') {
    return [
      '¡Hola Total Bri! Me interesa este producto:',
      '',
      `${quantity}× ${product.name.es}`,
      `Precio: ${formatPrice(product.price, locale)}`,
      `Subtotal: ${formatPrice(product.price * quantity, locale)} MXN`,
      '',
      '¿Tienen disponibilidad y cuánto sería el costo de envío?',
    ].join('\n');
  }
  return [
    'Hi Total Bri! I am interested in this product:',
    '',
    `${quantity}× ${product.name.en}`,
    `Price: ${formatPrice(product.price, locale)}`,
    `Subtotal: ${formatPrice(product.price * quantity, locale)} MXN`,
    '',
    'Is it in stock, and what is the shipping cost?',
  ].join('\n');
}

export function buildBulkInquiryMessage(form: BulkInquiry, locale: Locale): string {
  if (locale === 'es') {
    return [
      '¡Hola Total Bri! Me interesa una cotización al mayoreo.',
      '',
      `Nombre: ${form.name}`,
      `Negocio: ${form.businessName}`,
      `Volumen estimado: ${form.volume}`,
      `Categorías de interés: ${form.categories.join(', ') || 'No especificadas'}`,
      form.notes ? `Notas: ${form.notes}` : '',
      '',
      'Agradezco me envíen cotización y tiempos de entrega.',
    ]
      .filter(Boolean)
      .join('\n');
  }
  return [
    'Hi Total Bri! I would like a wholesale quote.',
    '',
    `Name: ${form.name}`,
    `Business: ${form.businessName}`,
    `Estimated volume: ${form.volume}`,
    `Categories of interest: ${form.categories.join(', ') || 'Not specified'}`,
    form.notes ? `Notes: ${form.notes}` : '',
    '',
    'Please send a quote and delivery times.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildProductQuestion(product: Product, locale: Locale): string {
  if (locale === 'es') {
    return `¡Hola Total Bri! Tengo una pregunta sobre: ${product.name.es}. ¿Me pueden ayudar?`;
  }
  return `Hi Total Bri! I have a question about: ${product.name.en}. Can you help me?`;
}
