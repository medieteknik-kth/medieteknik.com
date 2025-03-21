import { fontJetBrainsMono } from '@/app/fonts'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type { Author } from '@/models/Items'
import type Student from '@/models/Student'
import Image from 'next/image'
import {
  type HTMLAttributes,
  type JSX,
  type Ref,
  useCallback,
  useMemo,
} from 'react'
import { type Descendant, Editor, Text, Transforms, createEditor } from 'slate'
import {
  Editable,
  type RenderElementProps,
  Slate,
  withReact,
} from 'slate-react'

/**
 * @type BooleanMark
 * @description The possible types of toggleable text marks
 * @param bold - Bold
 * @param italic - Italic
 * @param underline - Underline
 * @param strikethrough - Strikethrough
 */
export type BooleanMark = 'bold' | 'italic' | 'underline' | 'strikethrough'

/**
 * @type ElementType
 * @description The possible types of text elements
 * @param h1 - Heading 1
 * @param h2 - Heading 2
 * @param h3 - Heading 3
 * @param h4 - Heading 4
 * @param paragraph - Paragraph
 * @param quote - Quote
 * @param multi-line code - Multi-line code
 * @param code - Code
 */
export type ElementType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'paragraph'
  | 'line break'
  | 'quote'
  | 'multi-line code'
  | 'code'
  | 'internal link'
  | 'external link'
  | 'image'
  | 'student tag'
  | 'committee tag'
  | 'committee position tag'

/**
 * @interface CustomElement
 * @description Interface for the custom element
 *
 * @property {ElementType} type - The type of the element
 * @property {string} url - The URL of the element (if applicable)
 * @property {object} image - The image of the element (if applicable)
 * @property {string} image.src - The source of the image
 * @property {string} image.alt - The alt text of the image
 * @property {number} image.width - The width of the image
 * @property {number} image.height - The height of the image
 * @property {object} tag - The tag of the element (if applicable)
 * @property {Author} tag.author - The author of the tag
 * @property {Descendant[]} children - The children of the element
 */
export interface CustomElement {
  type: ElementType
  url?: string
  image?: {
    src: string
    alt: string
    width: number
    height: number
  }
  tag?: {
    author: Author
  }
  children: Descendant[]
}

export interface CustomText {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

/**
 * @interface TextType
 * @description Interface for the text type
 *
 * @param label - The label of the text type
 * @param value - The value of the text type
 * @param style - The style of the text type
 */
interface TextType {
  label: string
  value: ElementType
  style: HTMLAttributes<HTMLElement>['className']
}

// TODO: Add translations for text types
export const textTypes: TextType[] = [
  {
    label: 'Heading 1',
    value: 'h1',
    style: 'text-3xl mb-1.5 mt-2 leading-tight font-bold',
  },
  {
    label: 'Heading 2',
    value: 'h2',
    style: 'text-2xl mb-1 mt-2',
  },
  {
    label: 'Heading 3',
    value: 'h3',
    style: 'text-xl mb-1 mt-1 font-bold',
  },
  {
    label: 'Heading 4',
    value: 'h4',
    style: 'text-lg mt-1',
  },
  {
    label: 'Paragraph',
    value: 'paragraph',
    style: 'text-base',
  },
  {
    label: 'Quote',
    value: 'quote',
    style: 'text-base italic border-l-4 border-gray-400 pl-2 my-2 rounded-l',
  },
  {
    label: 'Multi-line Code',
    value: 'multi-line code',
    style: 'font-mono text-base bg-gray-100',
  },
  {
    label: 'Code',
    value: 'code',
    style: 'font-mono text-base bg-gray-100',
  },
]

export const isMarkActive = (editor: Editor, format: BooleanMark) => {
  const marks: Omit<Text, 'text'> | null = Editor.marks(editor)
  return marks
    ? (marks as Record<BooleanMark, boolean>)[format] === true
    : false
}

export const toggleMark = (editor: Editor, format: BooleanMark) => {
  const isActive = isMarkActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  )
}

export const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: {
    'data-slate-leaf': true
  }
  children: React.ReactNode
  leaf: CustomText
}): JSX.Element => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }

  return <span {...attributes}>{children}</span>
}

export const ElementDisplay = ({
  attributes,
  children,
  element,
}: {
  attributes: {
    'data-slate-node': 'element'
    'data-slate-inline'?: true
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: Ref<HTMLElement | null> | undefined
  }
  children: React.ReactNode
  element: CustomElement
}): JSX.Element => {
  switch (element.type) {
    case 'h1':
      return (
        <h1
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
          ref={attributes.ref as Ref<HTMLHeadingElement> | undefined}
        >
          {children}
        </h1>
      )
    case 'h2':
      return (
        <h2
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
          ref={attributes.ref as Ref<HTMLHeadingElement> | undefined}
        >
          {children}
        </h2>
      )
    case 'h3':
      return (
        <h3
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
          ref={attributes.ref as Ref<HTMLHeadingElement> | undefined}
        >
          {children}
        </h3>
      )
    case 'h4':
      return (
        <h4
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
          ref={attributes.ref as Ref<HTMLHeadingElement> | undefined}
        >
          {children}
        </h4>
      )
    case 'quote':
      return (
        <blockquote
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
          ref={attributes.ref as Ref<HTMLQuoteElement> | undefined}
        >
          {children}
        </blockquote>
      )
    case 'multi-line code':
      return (
        <pre
          className={`${textTypes.find((type) => type.value === element.type)?.style} ${fontJetBrainsMono.className}`}
          {...attributes}
          ref={attributes.ref as Ref<HTMLPreElement> | undefined}
        >
          <code>{children}</code>
        </pre>
      )
    case 'code':
      return (
        <code
          className={`${textTypes.find((type) => type.value === element.type)?.style} inline-block ${fontJetBrainsMono.className}`}
          {...attributes}
        >
          {children}
        </code>
      )
    case 'internal link':
    case 'external link': {
      const { url } = element
      return (
        <a
          href={url}
          className={`text-base hover:underline underline-offset-4 inline-block cursor-pointer transition-all text-blue-600 dark:text-primary ${
            element.type === 'internal link'
              ? 'decoration-yellow-400 decoration-2'
              : 'decoration-sky-600'
          }`}
          title={
            element.type === 'internal link'
              ? 'Internal Link'
              : 'External Link (May not be secure)'
          }
          {...attributes}
          ref={attributes.ref as Ref<HTMLAnchorElement> | undefined}
          onMouseDown={(event) => event.preventDefault()} // Prevent default mouse down behavior
          onDragStart={(event) => event.preventDefault()} // Prevent dragging the link
          target='_blank'
          rel={
            element.type === 'external link'
              ? 'external nofollow noopener noreferrer'
              : 'me'
          }
        >
          {children}
        </a>
      )
    }
    case 'image': {
      const { image } = element
      if (!image) {
        return <></>
      }
      return (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          layout='responsive'
          loading='lazy'
          {...attributes}
          ref={attributes.ref as Ref<HTMLImageElement> | undefined}
        />
      )
    }
    case 'line break':
      return <br />
    case 'student tag':
    case 'committee tag':
    case 'committee position tag': {
      const { tag } = element

      if (!tag) {
        return <></>
      }

      if (element.type === 'student tag') {
        return (
          <span>
            <StudentTag
              student={tag.author as Student}
              language='sv'
              includeAt
              {...attributes}
              ref={attributes.ref as Ref<HTMLButtonElement> | undefined}
            >
              {children}
            </StudentTag>
          </span>
        )
      }
      if (element.type === 'committee tag') {
        return (
          <CommitteeTag
            committee={tag.author as Committee}
            language='sv'
            includeAt
            {...attributes}
            ref={attributes.ref as Ref<HTMLButtonElement> | undefined}
          >
            {children}
          </CommitteeTag>
        )
      }
      return (
        <span>
          <CommitteePositionTag
            committeePosition={tag.author as CommitteePosition}
            includeAt={true}
            includeImage={false}
            {...attributes}
          >
            {children}
          </CommitteePositionTag>
        </span>
      )
    }

    default:
      return (
        <p
          className={`${textTypes.find((type) => type.value === 'paragraph')?.style} block whitespace-pre-wrap break-words`}
          {...attributes}
          ref={attributes.ref as Ref<HTMLParagraphElement> | undefined}
        >
          {children}
        </p>
      )
  }
}

export const SlateDisplay = ({ value }: { value: Descendant[] }) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback((props: RenderElementProps) => {
    return <ElementDisplay {...props} />
  }, [])

  return (
    <Slate editor={editor} initialValue={value} onChange={() => {}}>
      <Editable renderElement={renderElement} renderLeaf={Leaf} readOnly />
    </Slate>
  )
}
