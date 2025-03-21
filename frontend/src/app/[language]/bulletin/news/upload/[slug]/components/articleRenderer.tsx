'use client'

import type News from '@/models/items/News'
import { useArticle } from '@/providers/ArticleProvider'
import { type JSX, useCallback, useMemo } from 'react'
import { type Descendant, Editor, Transforms } from 'slate'
import { Editable, type RenderElementProps, Slate } from 'slate-react'
import { AutoSaveResult, useAutoSave } from '../autoSave'
import { ElementDisplay, Leaf, toggleMark } from '../util/Text'

interface Props {
  news_data: News
}

/**
 * @name ArticleRenderer
 * @description The component that renders the article editor
 *
 * @param {Props} props
 * @param {string} props.language - The language of the article
 * @param {News} props.news_data - The news data
 *
 * @returns {JSX.Element} The article editor
 */
export default function ArticleRenderer({ news_data }: Props): JSX.Element {
  const { editor, setTextType, setActiveMarks, updateActiveMarks } =
    useArticle()
  const {
    saveCallback,
    autoSavePossible,
    content,
    updateContent,
    addNotification,
    currentLanguage,
  } = useAutoSave()

  const onMouseUp = useCallback(() => {
    if (!editor) {
      return
    }

    const { selection } = editor
    if (selection) {
      if (selection.anchor.path[0] !== selection.focus.path[0]) {
        setActiveMarks([])
      } else {
        const { anchor, focus } = selection
        const text = Editor.string(editor, { anchor, focus })
        if (text.trim() === '') {
          const linkNode = Editor.above(editor, {
            match: (n) =>
              'type' in n && 'children' in n && Editor.isInline(editor, n),
            mode: 'highest',
          })
          if (linkNode) {
            Transforms.select(editor, linkNode[1])
          }
          updateActiveMarks()
        } else {
          setActiveMarks([])
        }
      }
    }
  }, [editor, setActiveMarks, updateActiveMarks])

  const onMouseOver = useCallback(() => {
    if (!editor) {
      return
    }
    const { selection } = editor
    if (!selection) {
      updateActiveMarks()
    }
  }, [editor, updateActiveMarks])

  const initialValue = useMemo(() => {
    const correctedContent = content.translations[0].body
    if (correctedContent && correctedContent.length > 0) {
      return JSON.parse(correctedContent)
    }
    return [
      {
        type: 'h1',
        children: [{ text: 'Enter a heading' }],
      },
    ]
  }, [content.translations])

  const renderElement = useCallback((props: RenderElementProps) => {
    return <ElementDisplay {...props} />
  }, [])

  if (!editor) {
    return <></>
  }

  return (
    <div
      className='w-fit h-fit
      mt-24 bg-white rounded rounded-tl-md border border-neutral-200 border-r-neutral-100 border-b-neutral-100 dark:border-neutral-700 dark:border-r-neutral-800 dark:border-b-neutral-800 flex 
      relative flex-col justify-between dark:bg-[#181818] mb-10'
    >
      <span className='w-fit h-fit absolute bottom-4 right-8 text-neutral-500 dark:text-neutral-300'>
        1
      </span>
      <Slate
        editor={editor}
        initialValue={initialValue as Descendant[]}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (operation) => 'set_selection' !== operation.type
          )

          if (isAstChange) {
            const body = JSON.stringify(value)
            const updatedContent: News = {
              ...news_data,
              translations: [
                {
                  ...news_data.translations[0],
                  language_code: currentLanguage,
                  body: body,
                },
              ],
            }

            updateContent(updatedContent)
            if (autoSavePossible) {
              saveCallback(currentLanguage).then((result) => {
                if (result === AutoSaveResult.SUCCESS) {
                  addNotification('Auto-Saved')
                }
              })
            }
          }
        }}
      >
        <Editable
          className='w-[800px] h-[1000px] px-10 py-8'
          renderLeaf={Leaf}
          renderElement={renderElement}
          onMouseOver={onMouseOver}
          onMouseUp={onMouseUp}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()

              Transforms.insertNodes(editor, {
                type: 'paragraph',
                children: [{ text: '' }],
              })

              setTextType('paragraph')
            } else if (event.key === 'b' && event.ctrlKey) {
              event.preventDefault()
              toggleMark(editor, 'bold')
            } else if (event.key === 'i' && event.ctrlKey) {
              event.preventDefault()
              toggleMark(editor, 'italic')
            } else if (event.key === 'u' && event.ctrlKey) {
              event.preventDefault()
              toggleMark(editor, 'underline')
            } else if (event.key === 's' && event.ctrlKey) {
              event.preventDefault()
              toggleMark(editor, 'strikethrough')
            }
            updateActiveMarks()
          }}
        />
      </Slate>
    </div>
  )
}
