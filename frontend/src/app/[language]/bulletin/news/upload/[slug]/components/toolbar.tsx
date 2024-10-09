'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useArticle } from '@/providers/ArticleProvider'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  AtSymbolIcon,
  LinkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { useCallback } from 'react'
import { Transforms } from 'slate'
import { CustomElement } from '../util/Text'
import ToolbarMarks from './toolbar/marks'
import ToolbarText from './toolbar/text'

interface Props {
  language: string
}

/**
 * @name NewsToolbar
 * @description The toolbar for the news editor
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * 
 * @returns {JSX.Element} The news toolbar
 */
export default function NewsToolbar({ language }: Props): JSX.Element {
  // TODO: Reduce file length
  const { editor } = useArticle()

  if (!editor) {
    return <></>
  }

  const { t } = useTranslation(language, 'article')

  // Trusted domains
  const trustedDomains = ['https://www.medieteknik.com']

  // TODO: Separate?
  const insertLink = useCallback(
    (href: string, name: string, external: boolean) => {
      if (href) {
        const { selection } = editor
        if (selection) {
          const link: CustomElement = {
            type: external ? 'external link' : 'internal link',
            url: href,
            children: [{ text: name }],
          }
          editor.insertNodes(link, { at: selection.focus })

          editor.collapse({ edge: 'end' })
          editor.move({ distance: name.length, unit: 'character' })
          editor.move({ distance: 1, unit: 'offset' })

          editor.insertText(' ')
        }
      }
    },
    [editor]
  )

  const insertImage = useCallback(
    (src: string, alt: string, width: number, height: number) => {
      const { selection } = editor
      if (selection) {
        const image: CustomElement = {
          type: 'image',
          image: { src, alt, width, height },
          children: [{ text: '' }],
        }
        // TODO: Upload image ?
        Transforms.insertNodes(editor, image, {
          at: selection.focus,
        })
      }
    },
    [editor]
  )

  const insertTag = useCallback(
    (
      detail: string,
      tagType: 'committee' | 'committee position' | 'student'
    ) => {
      const { selection } = editor
      if (selection) {
        if (tagType === 'committee') {
          const tagNode: CustomElement = {
            type: 'committee tag',
            tag: {
              author: {
                author_type: 'COMMITTEE',
                email: '',
                logo_url: '',
                hidden: false,
                translations: [
                  {
                    title: detail,
                    description: '',
                    language_code: 'sv',
                  },
                ],
              },
            },
            children: [{ text: '' }],
          }

          Transforms.insertNodes(editor, tagNode, {
            at: selection.focus,
          })
        } else if (tagType === 'committee position') {
          const tagNode: CustomElement = {
            type: 'committee position tag',
            tag: {
              author: {
                author_type: 'COMMITTEE_POSITION',
                email: '',
                base: false,
                category: 'STYRELSEN',
                committee_position_id: '',
                active: true,
                role: 'ADMIN',
                weight: 0,
                translations: [
                  {
                    title: '',
                    description: '',
                    language_code: 'sv',
                  },
                ],
              },
            },
            children: [{ text: '' }],
          }

          Transforms.insertNodes(editor, tagNode, {
            at: selection.focus,
          })
        } else {
          const tagNode: CustomElement = {
            type: 'student tag',
            tag: {
              author: {
                author_type: 'STUDENT',
                student_id: '',
                email: '',
                first_name: detail,
                last_name: '',
                student_type: 'MEDIETEKNIK',
              },
            },
            children: [{ text: '' }],
          }

          Transforms.insertNodes(editor, tagNode, {
            at: selection.focus,
          })
        }
      }
    },
    [editor]
  )

  return (
    <div className='w-full h-20 bg-white dark:bg-[#141414] fixed flex items-center px-20 top-48 left-0 z-10'>
      <div className='w-full h-16 border rounded flex px-4'>
        <div className='flex items-center'>
          <Button
            size='icon'
            variant='ghost'
            className='mr-2'
            title={t('undo')}
            aria-label={t('undo')}
          >
            <ArrowUturnLeftIcon className='w-5 h-5 text-black dark:text-white' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            title={t('redo')}
            aria-label={t('redo')}
          >
            <ArrowUturnRightIcon className='w-5 h-5 text-black dark:text-white' />
          </Button>
        </div>
        <Separator orientation='vertical' className='mx-4 h-10 my-auto' />
        <ToolbarText language={language} />
        <Separator orientation='vertical' className='mx-4 h-10 my-auto' />

        <ToolbarMarks language={language} />
        <div className='mx-4 mr-4 py-2.5'>
          <Separator orientation='vertical' />
        </div>
        <div className='flex self-center items-center'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size='icon'
                variant='ghost'
                className='mr-1'
                title={t('insert') + ' ' + t('link')}
                aria-label={t('insert') + ' ' + t('link')}
              >
                <LinkIcon className='w-6 h-6 text-black dark:text-white' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('insert') + ' ' + t('link')}</DialogTitle>
                <DialogDescription>
                  {t('insert.link.description')}
                </DialogDescription>
              </DialogHeader>

              <Input
                type='text'
                id='link'
                title={t('insert') + ' ' + t('link')}
                aria-label={t('insert') + ' ' + t('link')}
                placeholder='https://example.com'
                className='w-full'
              />
              <Input
                type='text'
                id='linkName'
                placeholder={t('link.text')}
                title={t('link.text')}
                className='w-full'
              />
              <Button
                className='mt-4'
                title={t('insert') + ' ' + t('link')}
                aria-label={t('insert') + ' ' + t('link')}
                onClick={(e) => {
                  const link = e.currentTarget.parentElement?.querySelector(
                    '#link'
                  ) as HTMLInputElement
                  const linkName = e.currentTarget.parentElement?.querySelector(
                    '#linkName'
                  ) as HTMLInputElement

                  if (!link) return
                  if (!link.value) return

                  if (!linkName) return
                  if (!linkName.value) return

                  if (
                    link.value &&
                    trustedDomains.some((domain) => link.value.includes(domain))
                  ) {
                    // Trusted domains
                    insertLink(link.value, linkName.value, false)
                  } else if (link.value) {
                    // External links
                    insertLink(link.value, linkName.value, true)
                  }
                }}
              >
                {t('insert') + ' ' + t('link')}
              </Button>
            </DialogContent>
          </Dialog>
          <Button
            size='icon'
            variant='ghost'
            className='mr-1 cursor-not-allowed !pointer-events-auto'
            title={t('insert') + ' ' + t('image')}
            aria-label={t('insert') + ' ' + t('image')}
            disabled
          >
            <PhotoIcon className='w-6 h-6 text-black dark:text-white' />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size='icon'
                variant='ghost'
                className='mr-1'
                title={t('insert') + ' ' + t('tag')}
                aria-label={t('insert') + ' ' + t('tag')}
                disabled
              >
                <AtSymbolIcon className='w-6 h-6 text-black dark:text-white' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              {/* TODO: Add translations */}
              <DialogHeader>
                <DialogTitle>Insert Tag</DialogTitle>
                <DialogDescription>
                  Insert a tag to a person or committee.
                </DialogDescription>
              </DialogHeader>
              <Command>
                <CommandInput placeholder='Type a tag...' />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup heading='Committees'>
                    <CommandItem
                      onSelect={() => {
                        insertTag('Styrelsen', 'committee')
                      }}
                    >
                      Styrelsen
                    </CommandItem>
                  </CommandGroup>
                  <CommandGroup heading='People'>
                    <CommandItem>Person 1</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
