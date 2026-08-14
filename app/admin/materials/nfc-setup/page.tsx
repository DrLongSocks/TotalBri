import Link from 'next/link';
import { getMaterialsSortedByName } from '@/db/queries/materials';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { NfcSetupTable } from '@/features/admin/materials/NfcSetupTable';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

// Hardcoded rather than routed through env.NEXT_PUBLIC_SITE_URL: that var is
// set to https://totalbri.mx in production, which currently has no DNS
// records and doesn't resolve. total-bri.vercel.app is Vercel's permanent
// default alias for this project — it keeps working even after a custom
// domain is added later, so tags written against it never need to be
// reprogrammed. Revisit once totalbri.mx is actually pointed at Vercel.
const NFC_TAG_BASE_URL = 'https://total-bri.vercel.app';

export default async function NfcSetupPage() {
  await requireAdminSession();

  const [locale, allMaterials] = await Promise.all([getAdminLocale(), getMaterialsSortedByName()]);
  const materialsMessages = getAdminMessages(locale).materials;
  const nfcMessages = getAdminMessages(locale).nfcSetup;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <AdminPageHeading>{nfcMessages.title}</AdminPageHeading>
        <Link href="/admin/materials" className="text-sm text-azure hover:underline">
          {materialsMessages.backToMaterials}
        </Link>
      </div>

      <p className="max-w-2xl text-sm text-slate">{nfcMessages.instructions}</p>

      <NfcSetupTable
        materials={allMaterials}
        baseUrl={NFC_TAG_BASE_URL}
        messages={{
          nameLabel: materialsMessages.name,
          tagIdLabel: nfcMessages.tagIdLabel,
          urlLabel: nfcMessages.urlLabel,
          copy: nfcMessages.copy,
          copied: nfcMessages.copied,
          save: nfcMessages.save,
          duplicateError: nfcMessages.duplicateError,
        }}
      />
    </div>
  );
}
