import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { StudentTag } from '@/components/tags/StudentTag'
import Committee, { CommitteePosition } from '@/models/Committee'
import { Author } from '@/models/Items'
import Student from '@/models/Student'
import Image from 'next/image'
import { useCallback, useMemo } from 'react'
import { createEditor, Descendant, Editor, Text, Transforms } from 'slate'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

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
  style: string
}

export const textTypes: TextType[] = [
  {
    label: 'Heading 1',
    value: 'h1',
    style: 'text-3xl mb-2 mt-4',
  },
  {
    label: 'Heading 2',
    value: 'h2',
    style: 'text-2xl mb-2 mt-3',
  },
  {
    label: 'Heading 3',
    value: 'h3',
    style: 'text-xl mb-1 mt-2 font-bold',
  },
  {
    label: 'Heading 4',
    value: 'h4',
    style: 'text-lg mt-1 font-bold',
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

export const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: string) => {
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
  attributes: any
  children: any
  leaf: any
}) => {
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

  if (leaf.fontSize) {
    children = <span className={`text-[${leaf.fontSize}px]`}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
}

export const Element = ({
  attributes,
  children,
  element,
}: {
  attributes: any
  children: React.ReactNode
  element: CustomElement
}) => {
  switch (element.type) {
    case 'h1':
      return (
        <h1
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
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
        >
          {children}
        </blockquote>
      )
    case 'multi-line code':
      return (
        <pre
          className={
            textTypes.find((type) => type.value === element.type)?.style
          }
          {...attributes}
        >
          <code>{children}</code>
        </pre>
      )
    case 'code':
      return (
        <code
          className={
            textTypes.find((type) => type.value === element.type)?.style +
            ' inline-block'
          }
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
          className={`text-base underline underline-offset-4 inline-block cursor-pointer ${
            element.type === 'internal link'
              ? 'decoration-yellow-400'
              : 'decoration-sky-600'
          }`}
          title={
            element.type === 'internal link'
              ? 'Internal Link'
              : 'External Link (May not be secure)'
          }
          {...attributes}
          onMouseDown={(event) => event.preventDefault()} // Prevent default mouse down behavior
          onDragStart={(event) => event.preventDefault()} // Prevent dragging the link
          onClick={() => {
            window.open(url, '_blank')
          }}
        >
          {children}
        </a>
      )
    }
    case 'image':
      const { image } = element
      if (!image) {
        return <p></p>
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
        />
      )
    case 'line break':
      return <p {...attributes}>{children}</p>
    case 'student tag':
    case 'committee tag':
    case 'committee position tag': {
      const { tag } = element

      if (!tag) {
        return <p></p>
      }

      if (element.type === 'student tag') {
        return (
          <span>
            <StudentTag
              student={tag.author as Student}
              includeAt={true}
              includeImage={false}
              {...attributes}
            >
              {children}
            </StudentTag>
          </span>
        )
      } else if (element.type === 'committee tag') {
        return (
          <CommitteeTag
            committee={tag.author as Committee}
            includeAt={true}
            includeImage={false}
            {...attributes}
          >
            {children}
          </CommitteeTag>
        )
      } else {
        return (
          <span>
            <CommitteePositionTag
              committee_position={tag.author as CommitteePosition}
              includeAt={true}
              includeImage={false}
              {...attributes}
            >
              {children}
            </CommitteePositionTag>
          </span>
        )
      }
    }
    default:
      return (
        <p
          className={
            textTypes.find((type) => type.value === 'paragraph')?.style +
            ' inline-block whitespace-pre-wrap break-words'
          }
          {...attributes}
        >
          {children}
        </p>
      )
  }
}

export const SlateDisplay = ({ value }: { value: Descendant[] }) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />
  }, [])

  return (
    <Slate editor={editor} initialValue={value} onChange={() => {}}>
      <Editable renderElement={renderElement} renderLeaf={Leaf} readOnly />
    </Slate>
  )
}
