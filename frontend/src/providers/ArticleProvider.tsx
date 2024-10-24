'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { BaseEditor, Editor } from 'slate'
import { ReactEditor } from 'slate-react'

type ElementType =
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

type BooleanMark = 'bold' | 'italic' | 'underline' | 'strikethrough'

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

interface ArticleState {
  /**
   * @property {BaseEditor & ReactEditor} editor - The editor of the article
   */
  editor: (BaseEditor & ReactEditor) | undefined

  /**
   * @property {ElementType} currentType - The current type of the article
   */
  currentType: ElementType

  /**
   * @property {BooleanMark[]} marks - The marks of the article
   */
  marks: BooleanMark[]

  /**
   * @property {TextType[]} selctableTypes - The selectable types of the article
   */
  selctableTypes: TextType[]

  /**
   * @property {number} fontSize - The font size of the article
   */
  fontSize: number
}

type ArticleAction =
  | { type: 'SET_TYPE'; payload: ElementType }
  | { type: 'SET_MARKS'; payload: BooleanMark[] }
  | { type: 'SET_FONT_SIZE'; payload: number }

/**
 * @name articleReducer
 * @description The reducer for the article context
 *
 * @param {ArticleState} state - The state of the article context
 * @param {ArticleAction} action - The action of the article context
 * @returns {ArticleState} The state of the article context
 */
function articleReducer(
  state: ArticleState,
  action: ArticleAction
): ArticleState {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, currentType: action.payload }
    case 'SET_MARKS':
      return { ...state, marks: action.payload }
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload }
    default:
      return state
  }
}

const initialState: ArticleState = {
  editor: undefined,
  currentType: 'h1',
  marks: [],
  selctableTypes: [
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
  ],
  fontSize: 24,
}

/**
 * @interface ArticleContextType
 * @description Interface for the article context
 *
 * @extends ArticleState
 */
interface ArticleContextType extends ArticleState {
  /**
   * @name setTextType
   * @description Set the text type of the article
   *
   * @param {ElementType} type - The type of the article
   * @returns {void}
   */
  setTextType: (type: ElementType) => void

  setActiveMarks: (marks: BooleanMark[]) => void

  /**
   * @name updateActiveMarks
   * @description Update the active marks of the article for interactions
   *
   * @returns {void}
   */
  updateActiveMarks: () => void

  /**
   * @name setFontSize
   * @description Set the font size of the article
   *
   * @param {number} size - The size of the font
   * @returns {void}
   */
  setFontSize: (size: number) => void
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined)

interface Props {
  language: string
  editor: BaseEditor & ReactEditor
  children: React.ReactNode
}

/**
 * @name ArticleProvider
 * @description The provider for the article context
 *
 * @param {Props} props - The props of the component
 * @param {string} props.language - The language of the article
 * @param {React.ReactNode} props.children - The children of the component
 * @returns {React.ReactNode} The provider for the article context
 */
export function ArticleProvider({
  language,
  editor,
  children,
}: Props): React.ReactNode {
  const [state, dispatch] = useReducer(articleReducer, initialState)

  const updateActiveMarks = useCallback(() => {
    const marks = Editor.marks(editor) as Record<BooleanMark, boolean> | null
    if (!marks) return
    dispatch({
      type: 'SET_MARKS',
      payload: [
        marks.bold ? 'bold' : null,
        marks.italic ? 'italic' : null,
        marks.underline ? 'underline' : null,
        marks.strikethrough ? 'strikethrough' : null,
      ].filter(Boolean) as BooleanMark[],
    })
  }, [editor])

  const setActiveMarks = useCallback((marks: BooleanMark[]) => {
    dispatch({ type: 'SET_MARKS', payload: marks })
  }, [])

  const contextValue = useMemo(() => {
    return {
      ...state,
      editor,
      setTextType: (type: ElementType) =>
        dispatch({ type: 'SET_TYPE', payload: type }),
      setActiveMarks: (marks: BooleanMark[]) => setActiveMarks(marks),
      updateActiveMarks: () => updateActiveMarks(),
      setFontSize: (size: number) =>
        dispatch({ type: 'SET_FONT_SIZE', payload: size }),
    }
  }, [state, editor, setActiveMarks, updateActiveMarks])

  return (
    <ArticleContext.Provider value={contextValue}>
      {children}
    </ArticleContext.Provider>
  )
}

/**
 * @name useArticle
 * @description The hook for the article context
 *
 * @returns {ArticleContextType} The article context
 * @throws {Error} If the hook is not used within an ArticleProvider
 */
export function useArticle(): ArticleContextType {
  const context = useContext(ArticleContext)
  if (!context) {
    throw new Error('useArticle must be used within an ArticleProvider')
  }

  return context
}
