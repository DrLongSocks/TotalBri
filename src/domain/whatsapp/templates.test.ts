import { describe, expect, it } from 'vitest';
import {
  buildOrderMessage,
  buildSingleProductMessage,
  buildBulkInquiryMessage,
  buildProductQuestion,
} from './templates';
import type { Product } from '../product/schema';
import type { HydratedLine } from '../cart/totals';

function makeProduct(id: string, nameEs: string, price: number, inStock = true): Product {
  return {
    id,
    slug: id.toLowerCase(),
    name: { es: nameEs, en: nameEs },
    description: { es: 'd', en: 'd' },
    category: 'varios',
    subcategory: 'varios',
    price,
    images: ['/x.webp', 'https://placehold.co/1'],
    tags: [],
    inStock,
    featured: false,
  };
}

function line(product: Product, quantity: number): HydratedLine {
  return { line: { productId: product.id, quantity, addedAt: 1 }, product };
}

describe('whatsapp templates', () => {
  it('Spanish order includes cart items, subtotal, confirm text', () => {
    const lines = [
      line(makeProduct('P001', 'Cloralex 10 L', 140), 2),
      line(makeProduct('P002', 'Multiusos Lima-Limón', 12), 3),
    ];
    const msg = buildOrderMessage(lines, 2 * 140 + 3 * 12, 'es');
    expect(msg).toContain('¡Hola Total Bri!');
    expect(msg).toContain('Cloralex 10 L');
    expect(msg).toContain('Multiusos Lima-Limón');
    expect(msg).toContain('Subtotal');
    expect(msg).toContain('confirmar');
  });

  it('English order uses English phrases', () => {
    const lines = [line(makeProduct('P001', 'Multi-surface', 12), 1)];
    const msg = buildOrderMessage(lines, 12, 'en');
    expect(msg).toContain('Hi Total Bri!');
    expect(msg).toContain('Subtotal');
  });

  it('excludes out-of-stock lines from order message', () => {
    const lines = [
      line(makeProduct('P001', 'In Stock', 10), 1),
      line(makeProduct('P002', 'Out Of Stock', 20, false), 2),
    ];
    const msg = buildOrderMessage(lines, 10, 'es');
    expect(msg).toContain('In Stock');
    expect(msg).not.toContain('Out Of Stock');
  });

  it('truncates very long carts and encodes within 1800 chars', () => {
    const lines: HydratedLine[] = Array.from({ length: 60 }, (_, i) =>
      line(makeProduct(`P${String(i).padStart(3, '0')}`, `Producto especial número ${i} con nombre largo`, 100 + i), 3),
    );
    const msg = buildOrderMessage(lines, 1000, 'es');
    expect(encodeURIComponent(msg).length).toBeLessThanOrEqual(1800);
    expect(msg).toContain('productos más');
  });

  it('accents and ñ round-trip through encodeURIComponent', () => {
    const lines = [line(makeProduct('P001', 'Jícara y Pómex Española Ñ', 21), 1)];
    const msg = buildOrderMessage(lines, 21, 'es');
    const encoded = encodeURIComponent(msg);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(msg);
    expect(decoded).toContain('Jícara');
    expect(decoded).toContain('Pómex');
    expect(decoded).toContain('Española');
    expect(decoded).toContain('Ñ');
  });

  it('single product message snapshot (es)', () => {
    const msg = buildSingleProductMessage(makeProduct('P001', 'Cloralex 10 L', 140), 2, 'es');
    expect(msg).toMatchInlineSnapshot(`
      "¡Hola Total Bri! Me interesa este producto:

      2× Cloralex 10 L
      Precio: $140.00
      Subtotal: $280.00 MXN

      ¿Tienen disponibilidad y cuánto sería el costo de envío?"
    `);
  });

  it('bulk inquiry message renders fields', () => {
    const msg = buildBulkInquiryMessage(
      {
        name: 'Ana',
        businessName: 'Hotel Los Reyes',
        volume: '100 cajas / mes',
        categories: ['Limpieza', 'Higiene'],
        notes: 'Con factura',
      },
      'es',
    );
    expect(msg).toContain('Ana');
    expect(msg).toContain('Hotel Los Reyes');
    expect(msg).toContain('100 cajas / mes');
    expect(msg).toContain('Limpieza, Higiene');
    expect(msg).toContain('Con factura');
  });

  it('product question short message', () => {
    const msg = buildProductQuestion(makeProduct('P001', 'Gel Antibacterial', 60), 'es');
    expect(msg).toContain('Gel Antibacterial');
    expect(msg).toContain('¿Me pueden ayudar?');
  });
});
