'use client'
import { useTranslation } from '@/app/i18n/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import {
  Bars3Icon,
  Squares2X2Icon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function Toolbar({ language }: { language: string }) {
  const { permissions } = useAuthentication()
  const {
    selectedDocuments,
    setSelectedDocuments,
    removeDocument: deleteDocument,
    view,
    setView,
  } = useDocumentManagement()
  const { t } = useTranslation(language, 'document')

  return (
    <>
      <div className='w-full h-fit border-b ml-60 flex gap-4 items-center px-4 py-3'>
        <div className='w-fit rounded-md border flex items-center gap-1'>
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size='icon'
            title={t('view.grid')}
            onClick={() => {
              if (view === 'grid') return
              setView('grid')
            }}
          >
            <Squares2X2Icon className='w-6 h-6' />
          </Button>
          <Separator orientation='vertical' className='h-6' />
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size='icon'
            title={t('view.list')}
            onClick={() => {
              if (view === 'list') return
              setView('list')
            }}
          >
            <Bars3Icon className='w-6 h-6' />
          </Button>
        </div>
        {/*
          TODO: Add Search
          <Separator orientation='vertical' className='h-8' />
          <Input type='search' className='w-96' placeholder={t('search')} />*/}
      </div>
      <div className='grow h-12 border-b ml-60 px-4'>
        {selectedDocuments.length > 0 && (
          <div className='h-full flex gap-4 items-center'>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                title='Unselect All'
                onClick={() => setSelectedDocuments([])}
              >
                <XMarkIcon className='w-6 h-6' />
              </Button>
              <span className='tracking-wide'>
                {selectedDocuments.length} {t('document_selected')}
              </span>
            </div>
            <Separator orientation='vertical' className='h-6' />
            <div className='flex gap-2'>
              {permissions.author &&
                permissions.student &&
                permissions.author.includes('DOCUMENT') &&
                permissions.student.includes('ITEMS_DELETE') && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='destructive'
                        size='icon'
                        title={t('delete')}
                        className='w-8 h-8'
                      >
                        <TrashIcon className='w-5 h-5' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('delete') + '?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you'd like to delete{' '}
                          <span className='font-bold'>
                            {'"' +
                              selectedDocuments
                                .map((d) => d.translations[0].title)
                                .join('", "') +
                              '"'}
                          </span>
                          ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            for (const document of selectedDocuments) {
                              deleteDocument(document)
                            }
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
