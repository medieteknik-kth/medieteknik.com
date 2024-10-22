import { Separator } from '@/components/ui/separator'
import SearchBar from './toolbar/client/search'
import ViewSelect from './toolbar/client/viewSelect'
import CategorySelect from './toolbar/categorySelect'
import StatusSelect from './toolbar/client/statusSelect'
import SidebarAuth from './sidebar/client/sidebarAuth'

import type { JSX } from "react";

interface Props {
  language: string
}

/**
 * @name Toolbar
 * @description A component that displays the toolbar for the document management page.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @returns {Promise<JSX.Element>} The JSX code for the Toolbar component.
 */
export default async function Toolbar({
  language,
}: Props): Promise<JSX.Element> {
  return (
    <>
      <div className='grow h-fit border-b lg:ml-60 flex gap-4 items-center px-4 py-3 flex-wrap'>
        <ViewSelect language={language} />
        <div className='lg:hidden'>
          <SidebarAuth language={language} />
        </div>
        <div className='lg:hidden flex gap-2 items-center flex-wrap'>
          <Separator orientation='vertical' className='h-8' />
          <StatusSelect language={language} />
        </div>
        <div className='lg:hidden flex gap-2 items-center flex-wrap'>
          <CategorySelect language={language} />
        </div>
        <Separator orientation='vertical' className='h-8 hidden lg:block' />
        <Separator className='lg:hidden' />
        <SearchBar language={language} />
      </div>
      {/*
      <div className='grow h-12 border-b lg:ml-60 px-4 hidden'>
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
                            // TODO: Implement delete
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
      */}
    </>
  )
}
