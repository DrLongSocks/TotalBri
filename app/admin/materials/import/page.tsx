import Link from 'next/link';
import { db } from '@/db';
import { getMaterialsSortedByName } from '@/db/queries/materials';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { InvoiceUploadForm } from '@/features/admin/materials/InvoiceUploadForm';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

export default async function InvoiceImportPage() {
  await requireAdminSession();

  const [locale, allMaterials, pastImports] = await Promise.all([
    getAdminLocale(),
    getMaterialsSortedByName(),
    db.query.invoiceImports.findMany({ orderBy: (i, { desc }) => desc(i.createdAt), limit: 20 }),
  ]);
  const messages = getAdminMessages(locale).materials;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <AdminPageHeading>{messages.importTitle}</AdminPageHeading>
        <Link href="/admin/materials" className="text-sm text-azure hover:underline">
          {messages.backToMaterials}
        </Link>
      </div>

      <InvoiceUploadForm
        messages={messages}
        materials={allMaterials.map((m) => ({ id: m.id, name: m.name }))}
      />

      <div className="flex flex-col gap-3">
        <h2 className="eyebrow text-slate">{messages.importPastTitle}</h2>
        {pastImports.length === 0 ? (
          <p className="text-sm text-slate">{messages.importNoImports}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[var(--shadow-card)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-porcelain/50 text-slate">
                  <th className="px-4 py-3">{messages.importDateColumn}</th>
                  <th className="px-4 py-3">{messages.importFileColumn}</th>
                  <th className="px-4 py-3">{messages.importSupplierColumn}</th>
                </tr>
              </thead>
              <tbody>
                {pastImports.map((imp) => (
                  <tr key={imp.id} className="border-t border-ink/8">
                    <td className="px-4 py-3">{new Date(imp.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/materials/import/pdf?url=${encodeURIComponent(imp.fileUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-azure hover:underline"
                      >
                        {imp.fileName}
                      </a>
                    </td>
                    <td className="px-4 py-3">{imp.supplierName ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
