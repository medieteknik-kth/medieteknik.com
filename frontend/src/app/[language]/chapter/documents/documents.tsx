import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import { DocumentManagementProvider } from '@/providers/DocumentProvider'
import type { JSX } from 'react'
import Sidebar from './sidebar'
import View from './tabs/View'
import Toolbar from './toolbar'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Documents
 * @description The main component for the documents page.
 *
 * @param {Params} params - The dynamic parameters of the URL
 * @param {string} params.language - The currently selected language
 * @returns {Promise<JSX.Element>} The JSX code for the Documents component.
 */
export default async function Documents(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'document')

  return (
    <main>
      <HeadComponent title={t('title')} />
      <Tabs orientation='vertical' defaultValue={t('category.all')}>
        <DocumentManagementProvider language={language}>
          <Sidebar language={language} />
          <Toolbar language={language} />

          <>
            <TabsContent value={t('category.all')}>
              <View language={language} type='all' />
            </TabsContent>
            <TabsContent value={t('category.documents')}>
              <View language={language} type='documents' />
            </TabsContent>
            <TabsContent value={t('category.forms')}>
              <View language={language} type='forms' />
            </TabsContent>
          </>
        </DocumentManagementProvider>
      </Tabs>
    </main>
  )
}
