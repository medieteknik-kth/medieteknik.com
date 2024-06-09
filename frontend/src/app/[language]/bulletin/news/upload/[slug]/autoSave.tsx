'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { API_BASE_URL } from '@/utility/Constants'
import News from '@/models/Items'

export const AutoSaveResult = {
  SUCCESS: 'Saved',
  FAILED_RETRY: 'Failed to save, retrying in 30 seconds',
  FAILED_MAX_RETRIES: 'Failed to save, too many retries',
  FAILED: 'Failed to save',
} as const

export type AutoSaveResult =
  (typeof AutoSaveResult)[keyof typeof AutoSaveResult]

const AutoSaveContext = createContext<{
  content: News
  updateContent: (content: News) => void
  autoSavePossible: boolean
  saveCallback: (language_code: string, manual?: boolean) => Promise<string>
  notifications: string
  addNotification: (message: string) => void
}>({
  content: {} as News,
  updateContent: () => {},
  autoSavePossible: false,
  saveCallback: async () => 'Context not available',
  notifications: '',
  addNotification: () => {},
})

export function AutoSaveProvdier({
  slug,
  news_item,
  children,
}: {
  slug: string
  news_item: News
  children: React.ReactNode
}) {
  const [autoSavePossible, setAutoSavePossible] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [content, setContent] = useState<News>(news_item)
  const [notification, setNotification] = useState<string>('')

  const saveCallback = useCallback(
    async (language_code: string, manual: boolean = false) => {
      if (!autoSavePossible && !manual)
        return Promise.resolve(AutoSaveResult.FAILED)
      try {
        const response = await fetch(
          API_BASE_URL + `/news/${slug}?language_code=${language_code}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),
          }
        )

        if (response.ok) {
          setAutoSavePossible(false)
          setErrorCount(0)
          return AutoSaveResult.SUCCESS
        } else {
          if (manual) {
            return AutoSaveResult.FAILED
          }
          setAutoSavePossible(true)
          setErrorCount((prev) => prev + 1)

          if (errorCount > 3) {
            return AutoSaveResult.FAILED_MAX_RETRIES
          }

          setTimeout(() => {
            setAutoSavePossible(false)
            setErrorCount(0)
          }, 1000 * 30)

          return AutoSaveResult.FAILED_RETRY
        }
      } catch (error) {
        return AutoSaveResult.FAILED
      }
    },
    [autoSavePossible, errorCount, slug, content]
  )

  const updateContent = useCallback(
    (newContent: News) => {
      setContent(newContent)
    },
    [content]
  )

  const addNotification = useCallback(
    (message: string) => {
      setNotification(message)

      setTimeout(() => {
        setNotification((prevNotification) =>
          prevNotification === message ? '' : prevNotification
        )
      }, 5000)
    },
    [notification]
  )

  useEffect(() => {
    setInterval(() => {
      setAutoSavePossible(true)
    }, 1000 * 30)
  }, [autoSavePossible])

  return (
    <AutoSaveContext.Provider
      value={{
        content,
        updateContent,
        autoSavePossible,
        saveCallback,
        notifications: notification,
        addNotification,
      }}
    >
      {children}
    </AutoSaveContext.Provider>
  )
}

export function useAutoSave() {
  const context = useContext(AutoSaveContext)
  if (!context) {
    throw new Error('useAutoSave must be used within an AutoSaveProvider')
  }
  return context
}
