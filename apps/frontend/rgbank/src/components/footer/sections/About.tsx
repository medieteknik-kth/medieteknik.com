import { getTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

export default async function AboutSection({ language }: Props) {
  const { t } = await getTranslation(language, 'footer')
  return (
    <li className='w-full h-fit xl:w-1/4 border-t-2 mb-4 lg:mb-8 xl:mb-0 border-red-400 pt-4 px-0 xxs:pl-4 grid xs:flex flex-col place-items-center items-start gap-2'>
      <h4 className='text-2xl tracking-wider font-bold'>{t('about.title')}</h4>
      <div>{t('about.description')}</div>
    </li>
  )
}
