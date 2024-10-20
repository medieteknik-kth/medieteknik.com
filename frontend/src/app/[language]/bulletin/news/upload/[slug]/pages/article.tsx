'use client'
import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentIcon,
  TagIcon,
  HandThumbUpIcon,
  CogIcon,
  ChevronUpDownIcon,
  CheckIcon,
  LinkIcon,
  PhotoIcon,
  AtSymbolIcon,
} from '@heroicons/react/24/outline'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { createEditor, Editor, Descendant, Transforms, BaseEditor } from 'slate'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from 'slate-react'
import {
  Leaf,
  Element,
  BooleanMark,
  toggleMark,
  ElementType,
  textTypes,
  CustomElement,
} from '../util/Text'
import { Input } from '@/components/ui/input'
import { News } from '@/models/Items'
import { useAutoSave, AutoSaveResult } from '../autoSave'
import { useRouter } from 'next/navigation'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
  }
}

export default function ArticlePage({
  language,
  news_data,
}: {
  language: string
  news_data: News
}) {
  const [fontSize, setFontSize] = useState(24)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('h1')
  const [editor] = useState(() => withReact(createEditor()))
  const [activeMarks, setActiveMarks] = useState<BooleanMark[]>([])
  const {
    saveCallback,
    content,
    updateContent,
    addNotification,
    currentLanguage,
    switchCurrentLanguage,
  } = useAutoSave()
  const { push } = useRouter()

  if (Object.keys(news_data).length === 0) {
    push('/' + language + '/bulletin/news')
    return
  }

  const initialValue = useMemo(() => {
    let correctedContent = content.translations[0].body
    if (correctedContent && correctedContent.length > 0) {
      return JSON.parse(correctedContent)
    }
    return [
      {
        type: 'h1',
        children: [{ text: 'Enter in a title' }],
      },
    ]
  }, [])

  const updateFontSize = (size: number) => {
    if (size == -1) size = fontSize
    setFontSize(size)
  }

  const getMarks = useCallback(() => Editor.marks(editor), [editor])

  const updateActiveMarks = useCallback(() => {
    const marks = getMarks() as Record<BooleanMark, boolean> | null
    if (!marks) return
    setActiveMarks(
      [
        marks.bold ? 'bold' : null,
        marks.italic ? 'italic' : null,
        marks.underline ? 'underline' : null,
        marks.strikethrough ? 'strikethrough' : null,
      ].filter(Boolean) as BooleanMark[]
    )
  }, [setActiveMarks])

  const onMouseUp = useCallback(() => {
    const { selection } = editor
    if (selection) {
      if (selection.anchor.path[0] !== selection.focus.path[0]) {
        setActiveMarks([])
      } else {
        const { anchor, focus } = selection
        const text = Editor.string(editor, { anchor, focus })
        if (text.trim() === '') {
          const linkNode = Editor.above(editor, {
            match: (n) => 'type' in n && Editor.isInline(editor, n),
            mode: 'highest',
          })
          if (linkNode) {
            Transforms.select(editor, linkNode[1])
          } else {
            updateActiveMarks()
          }

          updateActiveMarks()
        } else {
          setActiveMarks([])
        }
      }
    }
  }, [editor, getMarks, setActiveMarks])

  const onMouseOver = useCallback(() => {
    const { selection } = editor
    if (!selection) {
      updateActiveMarks()
    }
  }, [editor, getMarks, updateActiveMarks])

  const toggleTextType = useCallback(
    (type: ElementType) => {
      Transforms.setNodes(
        editor,
        { type: type },
        { match: (n) => 'type' in n && Editor.isBlock(editor, n) }
      )
      setValue(type)
    },
    [editor]
  )

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
          Transforms.insertNodes(editor, link, {
            at: selection.focus,
          })
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

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />
  }, [])

  return (
    <section className='w-full h-fit flex justify-center relative'>
      <div className='w-full h-20 bg-white dark:bg-[#141414] fixed flex items-center px-20 top-48 left-0 z-10'>
        <div className='w-full h-16 border rounded flex px-4'>
          <div className='flex items-center'>
            <Button
              size='icon'
              variant='ghost'
              className='mr-2'
              title='Undo'
              aria-label='Undo'
            >
              <ArrowUturnLeftIcon className='w-5 h-5 text-black dark:text-white' />
            </Button>
            <Button size='icon' variant='ghost' title='Redo' aria-label='Redo'>
              <ArrowUturnRightIcon className='w-5 h-5 text-black dark:text-white' />
            </Button>
          </div>
          <div className='mx-4 py-2.5'>
            <Separator orientation='vertical' />
          </div>
          <div className='flex self-center'>
            <div className='flex self-center items-center'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    title='Text Type'
                    aria-label='Text Type'
                    aria-expanded={open}
                    className={
                      textTypes.find((type) => type.value === value)?.style +
                      ' w-72 flex justify-between m-0'
                    }
                  >
                    {textTypes.find((type) => type.value === value)?.label}
                    <ChevronUpDownIcon className='w-6 h-6' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder='Search Text Type' />
                    <CommandList>
                      <CommandEmpty>No results found</CommandEmpty>
                      <CommandGroup heading='Type'>
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
                            {type.value === value && (
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
                title='Font Size (WIP)'
                aria-label='Font Size'
                disabled
                readOnly
                value={fontSize}
                onChange={(e) => {
                  updateFontSize(parseInt(e.target.value))
                }}
              />
            </div>
          </div>
          <div className='mx-4 py-2.5'>
            <Separator orientation='vertical' />
          </div>
          <div className='self-center'>
            <ToggleGroup
              type='multiple'
              className='dark:text-white dark:bg-[#111] *:w-10'
              value={activeMarks}
              onValueChange={(value: BooleanMark[]) => setActiveMarks(value)}
            >
              <ToggleGroupItem
                value='bold'
                aria-label='Toggle bold'
                title='Toggle bold'
                className='data-[state=on]:bg-yellow-400'
                onClick={() => toggleMark(editor, 'bold')}
              >
                <span className='font-bold text-xl'>B</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value='italic'
                aria-label='Toggle italic'
                title='Toggle italic'
                className='data-[state=on]:bg-yellow-400'
                onClick={() => toggleMark(editor, 'italic')}
              >
                <span className='italic text-xl'>I</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value='underline'
                aria-label='Toggle underline'
                title='Toggle underline'
                className='data-[state=on]:bg-yellow-400'
                onClick={() => toggleMark(editor, 'underline')}
              >
                <span className='underline text-xl'>U</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value='strikethrough'
                aria-label='Toggle strikethrough'
                title='Toggle strikethrough'
                className='data-[state=on]:bg-yellow-400'
                onClick={() => toggleMark(editor, 'strikethrough')}
              >
                <span className='line-through text-xl'>S</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
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
                  title='Insert Link'
                  aria-label='Insert Link'
                >
                  <LinkIcon className='w-6 h-6 text-black dark:text-white' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Link</DialogTitle>
                  <DialogDescription>
                    Insert a link to a page or a file.
                  </DialogDescription>
                </DialogHeader>

                <Input
                  type='text'
                  id='link'
                  title='Link URL'
                  aria-label='Link URL'
                  placeholder='https://example.com'
                  className='w-full'
                />
                <Input
                  type='text'
                  id='linkName'
                  placeholder='Link Text'
                  title='Link Text (alt text)'
                  className='w-full'
                />
                <Button
                  className='mt-4'
                  title='Insert Link'
                  aria-label='Insert Link'
                  onClick={(e) => {
                    const link = e.currentTarget.parentElement?.querySelector(
                      '#link'
                    ) as HTMLInputElement
                    const linkName =
                      e.currentTarget.parentElement?.querySelector(
                        '#linkName'
                      ) as HTMLInputElement

                    if (!link) return
                    if (!link.value) return

                    if (!linkName) return
                    if (!linkName.value) return

                    const trustedDomains = ['example.com']
                    if (
                      link.value &&
                      trustedDomains.includes(new URL(link.value).hostname)
                    ) {
                      insertLink(link.value, linkName.value, false)
                    } else if (link.value) {
                      insertLink(link.value, linkName.value, true)
                    }
                  }}
                >
                  Insert Link
                </Button>
              </DialogContent>
            </Dialog>
            <Button
              size='icon'
              variant='ghost'
              className='mr-1 cursor-not-allowed !pointer-events-auto'
              title='Insert Photo (WIP)'
              aria-label='Insert Photo'
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
                  title='Insert Tag'
                  aria-label='Insert Tag'
                >
                  <AtSymbolIcon className='w-6 h-6 text-black dark:text-white' />
                </Button>
              </DialogTrigger>
              <DialogContent>
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
              saveCallback(currentLanguage).then((result) => {
                if (result === AutoSaveResult.SUCCESS) {
                  addNotification('Auto-Saved')
                }
              })
            }
          }}
        >
          <Editable
            className='w-[800px] h-[1000px] px-10 py-8'
            renderLeaf={Leaf}
            renderElement={renderElement}
            onMouseUp={onMouseUp}
            onMouseOver={onMouseOver}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                editor.insertNode({
                  type: 'line break',
                  children: [{ text: '' }],
                })
                setValue('paragraph')
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
              } else if (event.key === ' ') {
                const exemptedBlocks = Editor.above(editor, {
                  match: (n) =>
                    'type' in n &&
                    Editor.isBlock(editor, n) &&
                    (n.type === 'quote' ||
                      n.type === 'multi-line code' ||
                      n.type === 'h1' ||
                      n.type === 'h2' ||
                      n.type === 'h3' ||
                      n.type === 'h4'),
                })
                if (exemptedBlocks) return
                event.preventDefault()
                const currentBlock = Editor.above(editor, {
                  match: (n) =>
                    'type' in n &&
                    Editor.isBlock(editor, n) &&
                    n.type === 'line break',
                })

                if (currentBlock) {
                  setValue('paragraph')
                  toggleTextType('paragraph')
                }
                editor.insertNode({
                  type: 'paragraph',
                  children: [{ text: ' ' }],
                })
              }
              updateActiveMarks()
            }}
          />
        </Slate>
      </div>
    </section>
  )
}
