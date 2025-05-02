'use client'

import { useTranslation } from '@/app/i18n/client'
import AdminCategoriesSection from '@/components/details/admin/categories'
import AdminStatusSection from '@/components/details/admin/status'
import type { ExpenseResponse } from '@/models/Expense'
import type { ExpenseStatus } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
  updateStatus: (status: ExpenseStatus) => void
}

export default function AdminSection({
  language,
  invoice,
  expense,
  updateStatus,
}: Props) {
  const { t } = useTranslation(language, 'processing')

  if (!invoice && !expense) {
    return null
  }

  if (invoice && expense) {
    return null
  }

  const item = invoice ?? expense

  if (!item) {
    return null
  }

  return (
    <section className='flex flex-col gap-4 mt-2'>
      <h3 className='text-lg font-medium'>{t('admin.title')}</h3>
      <div className='space-y-4'>
        <AdminStatusSection
          language={language}
          item={item}
          updateStatus={updateStatus}
        />
        <AdminCategoriesSection language={language} item={item} />
      </div>
    </section>
  )
}
