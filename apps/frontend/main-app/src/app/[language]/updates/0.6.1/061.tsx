import { useTranslation } from '@/app/i18n'
import {
  NewBadge,
  RemovedBadge,
  UpdatedBadge,
} from '@/components/badges/Updates'
import { HeadComponent } from '@/components/static/Static'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Version061(props: Props) {
  const { language } = await props.params
  const { t: commonT } = await useTranslation(language, 'updates/common')
  const { t } = await useTranslation(language, 'updates/versions/0.6.1')

  return (
    <main className='pb-8'>
      <HeadComponent title='0.6.1' />
      <section className='px-10 md:px-40 desktop:px-[475px]'>
        <h2 className='text-xl sm:text-3xl font-bold mt-10 mb-5'>
          {commonT('overview')}
        </h2>
        <p>{t('overview_1')}</p>
      </section>
      <section className='px-10 md:px-40 desktop:px-[475px]'>
        <h2 className='text-xl sm:text-3xl font-bold mt-10 mb-5'>
          {commonT('general')}
        </h2>
        <ul className='flex flex-col sm:gap-2 gap-4'>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <NewBadge language={language} />
            <p>
              <Link
                href={`/${language}/updates`}
                className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary decoration-yellow-400 decoration-2'
              >
                {`/${language}/updates`}
              </Link>
              {t('general_1')}
            </p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <NewBadge language={language} />
            <p>{t('general_2')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('general_3')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('general_4')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('general_5')}</p>
          </li>
        </ul>
      </section>
      <section className='px-10 md:px-40 desktop:px-[475px]'>
        <h2 className='text-xl sm:text-3xl font-bold mt-10 mb-5'>
          {commonT('ui_ux')}
        </h2>
        <ul className='flex flex-col sm:gap-2 gap-4'>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <NewBadge language={language} />
            <p>{t('ui_ux_1')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <NewBadge language={language} />
            <p>{t('ui_ux_2')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <NewBadge language={language} />
            <p>{t('ui_ux_3')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('ui_ux_4')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('ui_ux_5')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>
              <Link
                href={`/${language}/chapter/committees`}
                className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary decoration-yellow-400 decoration-2'
              >
                {`/${language}/chapter/committees`}
              </Link>
              {t('ui_ux_6')}
            </p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('ui_ux_7')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('ui_ux_8')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('ui_ux_9')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <RemovedBadge language={language} />
            <p>{t('ui_ux_10')}</p>
          </li>
        </ul>
      </section>
      <section className='px-10 md:px-40 desktop:px-[475px]'>
        <h2 className='text-xl sm:text-3xl font-bold mt-10 mb-4'>
          {commonT('qol')}
        </h2>
        <ul className='flex flex-col sm:gap-2 gap-4'>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <NewBadge language={language} />
            <p>{t('qol_1')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('qol_2')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>
              <Link
                href={`/${language}/chapter/positions`}
                className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary decoration-yellow-400 decoration-2'
              >
                {`/${language}/chapter/positions`}
              </Link>
              {t('qol_3')}
            </p>
          </li>
        </ul>
      </section>
      <section className='px-10 md:px-40 desktop:px-[475px]'>
        <h2 className='text-xl sm:text-3xl font-bold mt-10 mb-5'>
          {commonT('bugfixes')}
        </h2>
        <ul className='flex flex-col sm:gap-2 gap-4'>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('bugfixes_1')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('bugfixes_2')}</p>
          </li>
          <li className='flex sm:items-center gap-0.5 sm:gap-2 flex-col sm:flex-row'>
            <UpdatedBadge language={language} />
            <p>{t('bugfixes_3')}</p>
          </li>
        </ul>
      </section>
    </main>
  )
}
