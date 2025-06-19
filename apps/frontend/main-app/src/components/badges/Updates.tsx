import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

export async function ExperimentalBadge({ language }: Props) {
  const { t } = await useTranslation(language, 'updates/common')
  return (
    <span
      className='px-2 py-1 bg-cyan-600 text-white text-xs font-bold rounded-md select-none hover:scale-110 transition-transform'
      title={t('tooltip_experimental')}
    >
      {t('badge_experimental')}
    </span>
  )
}

export async function NewBadge({ language }: Props) {
  const { t } = await useTranslation(language, 'updates/common')
  return (
    <span className='px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-md select-none hover:scale-110 transition-transform'>
      {t('badge_new')}
    </span>
  )
}

export async function UpdatedBadge({ language }: Props) {
  const { t } = await useTranslation(language, 'updates/common')
  return (
    <span className='px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-md select-none hover:scale-110 transition-transform'>
      {t('badge_updated')}
    </span>
  )
}

export async function RemovedBadge({ language }: Props) {
  const { t } = await useTranslation(language, 'updates/common')
  return (
    <span className='px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-md select-none hover:scale-110 transition-transform'>
      {t('badge_removed')}
    </span>
  )
}
