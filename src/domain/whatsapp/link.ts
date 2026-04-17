export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function isUrlTooLong(phone: string, message: string, limit = 1800): boolean {
  return buildWhatsAppUrl(phone, message).length > limit;
}
