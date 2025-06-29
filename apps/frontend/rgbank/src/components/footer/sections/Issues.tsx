import { getTranslation } from '@/app/i18n'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

interface Props {
  language: LanguageCode
}

export default async function IssueSection({ language }: Props) {
  const { t } = await getTranslation(language, 'footer')
  return (
    <li className='w-full h-fit xl:w-1/4 border-t-2 mb-4 lg:mb-8 xl:mb-0 border-blue-400 pt-4 px-0 xxs:pl-4 grid xs:flex flex-col place-items-center items-start gap-2'>
      <h4 className='text-2xl text-center xs:text-left tracking-wider font-bold'>
        {t('issues.title')}
      </h4>
      <div>
        {t('issues.description')}{' '}
        <a
          href='https://github.com/medieteknik-kth/medieteknik.com/issues/new'
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 dark:text-primary hover:underline'
          title='Create an issue on GitHub'
          aria-label='Create an issue on GitHub'
        >
          {t('issues.description.github')}
        </a>
      </div>
    </li>
  )
}
