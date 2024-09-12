import { Head } from '@/components/static/Static'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import View from './tabs/View'
import { DocumentManagementProvider } from '@/providers/DocumentProvider'
import Toolbar from './client/toolbar'
import Sidebar from './sidebar'
import { useTranslation } from '@/app/i18n'

type View = 'grid' | 'list'

interface Props {
  language: string
}

interface Params {
  params: Props
}

export default async function Documents({ params: { language } }: Params) {
  const { t } = await useTranslation(language, 'document')

  return (
    <main>
      <div className='h-24 bg-black' />
      <Head title={t('title')} />
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
