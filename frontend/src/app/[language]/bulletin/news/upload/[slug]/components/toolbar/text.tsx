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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useArticle } from '@/providers/ArticleProvider'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useCallback, useState, type JSX } from 'react'
import { Editor, Transforms } from 'slate'
import { ElementType, textTypes } from '../../util/Text'
import { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

/**
 * @name ToolbarText
 * @description The component that renders the text section of the toolbar, such as text type and font size
 *
 * @param {Props} props
 * @param {string} props.language - The language of the article
 *
 * @returns {JSX.Element} The text section of the toolbar
 */
export default function ToolbarText({ language }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const { fontSize, setFontSize, setTextType, currentType, editor } =
    useArticle()

  const { t } = useTranslation(language, 'article')

  const toggleTextType = useCallback(
    (type: ElementType) => {
      if (!editor) {
        return
      }
      Transforms.setNodes(
        editor,
        { type: type },
        { match: (n) => 'type' in n && Editor.isBlock(editor, n) }
      )
      setTextType(type)
    },
    [editor, setTextType]
  )

  if (!editor) {
    return <></>
  }

  // TODO: Implement variable font sizes
  const updateFontSize = (size: number) => {
    if (size == -1) size = fontSize
    setFontSize(size)
  }

  return (
    <div className='flex self-center'>
      <div className='flex self-center items-center'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              title={t('textType')}
              aria-label={t('textType')}
              aria-expanded={open}
              className={
                textTypes.find((type) => type.value === currentType)?.style +
                ' w-72 flex justify-between m-0'
              }
            >
              {textTypes.find((type) => type.value === currentType)?.label}
              <ChevronUpDownIcon className='w-6 h-6' />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder={t('search') + ' ' + t('textType')} />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup heading={t('textType')}>
                  {textTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      onSelect={() => {
                        setOpen(false)
                        toggleTextType(type.value as ElementType)
                      }}
                      className={
                        type.style + ' flex items-center cursor-pointer'
                      }
                    >
                      {type.value === currentType && (
                        <CheckIcon className='w-4 h-4 mr-2 text-green-600' />
                      )}
                      {type.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          type='number'
          id='font-size'
          name='font-size'
          className='w-fit max-w-20 ml-4'
          title={t('fontSize') + ' WIP'}
          aria-label={t('fontSize')}
          disabled
          readOnly
          value={fontSize}
          onChange={(e) => {
            updateFontSize(parseInt(e.target.value))
          }}
        />
      </div>
    </div>
  )
}
