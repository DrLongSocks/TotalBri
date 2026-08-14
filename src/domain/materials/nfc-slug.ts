// A readable default NFC tag id suggestion, derived from the material name —
// e.g. "Limón 990" -> "limon-990". Just a pre-fill on the setup form; the
// admin can edit it before saving, and the DB's uniqueness constraint is
// what actually enforces no two materials share a tag.
export function slugifyForNfcTag(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
