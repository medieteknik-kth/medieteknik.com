'use client';
import { useTranslation } from '@/app/i18n/client'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useArticle } from '@/providers/ArticleProvider'
import { BooleanMark, toggleMark } from '../../util/Text'

import type { JSX } from "react";

interface Props {
  language: string
}

/**
 * @name ToolbarMarks
 * @description The component that renders the marks section of the toolbar, such as bold, italic, underline, and strikethrough
 *
 * @param {Props} props
 * @param {string} props.language - The language of the article
 *
 * @returns {JSX.Element} The marks section of the toolbar
 */
export default function ToolbarMarks({ language }: Props): JSX.Element {
  const { marks, setActiveMarks, editor } = useArticle()

  if (!editor) {
    return <></>
  }

  const { t } = useTranslation(language, 'article')

  return (
    <ToggleGroup
      type='multiple'
      className='dark:text-white dark:bg-[#111] *:w-10 self-center'
      value={marks}
      onValueChange={(value: BooleanMark[]) => setActiveMarks(value)}
    >
      <ToggleGroupItem
        value='bold'
        aria-label={t('toggle') + ' ' + t('bold')}
        title={t('toggle') + ' ' + t('bold')}
        className='data-[state=on]:bg-yellow-400'
        onClick={() => toggleMark(editor, 'bold')}
      >
        <span className='font-bold text-xl'>B</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value='italic'
        aria-label={t('toggle') + ' ' + t('italic')}
        title={t('toggle') + ' ' + t('italic')}
        className='data-[state=on]:bg-yellow-400'
        onClick={() => toggleMark(editor, 'italic')}
      >
        <span className='italic text-xl'>I</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value='underline'
        aria-label={t('toggle') + ' ' + t('underline')}
        title={t('toggle') + ' ' + t('underline')}
        className='data-[state=on]:bg-yellow-400'
        onClick={() => toggleMark(editor, 'underline')}
      >
        <span className='underline text-xl'>U</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value='strikethrough'
        aria-label={t('toggle') + ' ' + t('strikethrough')}
        title={t('toggle') + ' ' + t('strikethrough')}
        className='data-[state=on]:bg-yellow-400'
        onClick={() => toggleMark(editor, 'strikethrough')}
      >
        <span className='line-through text-xl'>S</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
