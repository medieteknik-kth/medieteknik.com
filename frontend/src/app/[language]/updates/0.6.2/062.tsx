import Update, {
  type Changes,
} from '@/app/[language]/updates/components/change'
import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Version062(props: Props) {
  const { language } = await props.params
  const { t: commonT } = await useTranslation(language, 'updates/common')
  const { t } = await useTranslation(language, 'updates/versions/0.6.2')

  const experimentalChanges: Changes[] = [
    {
      title: t('experimental_1'),
      explanation: t('experimental_1_explanation'),
    },
    {
      title: t('experimental_2'),
      explanation: t('experimental_2_explanation'),
    },
  ]

  const generalChanges: Changes[] = [
    {
      title: t('general.new_1'),
      explanation: t('general.new_1_explanation'),
    },
    {
      title: t('general.new_2'),
      explanation: t('general.new_2_explanation'),
    },
    {
      title: t('general.new_3'),
      explanation: t('general.new_3_explanation'),
    },
  ]

  const newUIUXChanges: Changes[] = [
    {
      title: t('ui_ux.new_1'),
    },
  ]

  const updatedUIUXChanges: Changes[] = [
    {
      title: t('ui_ux.updated_1'),
    },
    {
      title: t('ui_ux.updated_2'),
      explanation: t('ui_ux.updated_2_explanation'),
    },
    {
      title: t('ui_ux.updated_3'),
      explanation: t('ui_ux.updated_3_explanation'),
    },
    {
      title: t('ui_ux.updated_4'),
    },
    {
      title: t('ui_ux.updated_5'),
      explanation: t('ui_ux.updated_5_explanation'),
    },
    {
      title: t('ui_ux.updated_6'),
      explanation: t('ui_ux.updated_6_explanation'),
    },
    {
      title: t('ui_ux.updated_7'),
    },
  ]

  const removedUIUXChanges: Changes[] = [
    {
      title: t('ui_ux.removed_1'),
      explanation: t('ui_ux.removed_1_explanation'),
    },
  ]

  const qolChanges: Changes[] = [
    {
      title: t('qol.new_1'),
      explanation: t('qol.new_1_explanation'),
    },
    {
      title: t('qol.new_2'),
      explanation: t('qol.new_2_explanation'),
    },
    {
      title: t('qol.new_3'),
    },
  ]

  const bugfixesChanges: Changes[] = [
    {
      title: t('bugfixes_1'),
    },
    {
      title: t('bugfixes_2'),
    },
    {
      title: t('bugfixes_3'),
    },
  ]

  return (
    <main className='pb-8'>
      <HeadComponent title='0.6.2' />
      <div className='xl:w-[50vw] mx-auto container flex flex-col gap-6 mt-4'>
        <section id='introduction'>
          <h2 className='text-xl sm:text-2xl font-bold mb-1 tracking-tight'>
            {commonT('overview')}
          </h2>
          <p>{t('overview_1')}</p>
        </section>

        <Update
          language={language}
          title={commonT('general')}
          id='general'
          updateList={[
            {
              type: 'experimental',
              changes: experimentalChanges,
            },
            {
              type: 'new',
              changes: generalChanges,
            },
          ]}
        />

        <Separator className='my-4' />

        <Update
          language={language}
          title={commonT('ui_ux')}
          id='ui_ux'
          updateList={[
            {
              type: 'new',
              changes: newUIUXChanges,
            },
            {
              type: 'update',
              changes: updatedUIUXChanges,
            },
            {
              type: 'remove',
              changes: removedUIUXChanges,
            },
          ]}
        />

        <Separator className='my-4' />

        <Update
          language={language}
          title={commonT('qol')}
          id='qol'
          updateList={[
            {
              type: 'new',
              changes: qolChanges,
            },
          ]}
        />

        <Separator className='my-4' />

        <Update
          language={language}
          title={commonT('bugfixes')}
          id='bugfixes'
          updateList={[
            {
              type: 'update',
              changes: bugfixesChanges,
            },
          ]}
        />
      </div>
    </main>
  )
}
