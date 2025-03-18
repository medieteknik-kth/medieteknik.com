'use client'

import type { LanguageCode } from '@/models/Language'
import type News from '@/models/items/News'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { mutate } from 'swr'

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
  saveCallback: (language_code: string, override?: boolean) => Promise<string>
  notifications: string
  addNotification: (message: string) => void
  currentLanguage: LanguageCode
  switchCurrentLanguage: (language_code: LanguageCode) => void
}>({
  content: {} as News,
  updateContent: () => {},
  autoSavePossible: false,
  saveCallback: async () => 'Context not available',
  notifications: '',
  addNotification: () => {},
  currentLanguage: 'sv',
  switchCurrentLanguage: () => {},
})

interface Props {
  slug: string
  news_item: News
  language: LanguageCode
  children: React.ReactNode
}

export function AutoSaveProvdier({
  slug,
  news_item,
  language,
  children,
}: Props) {
  const [autoSavePossible, setAutoSavePossible] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [content, setContent] = useState<News>(news_item)
  const [notification, setNotification] = useState<string>('')
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(language)

  const saveCallback = useCallback(
    async (language_code: string, override = false) => {
      if (!autoSavePossible && !override)
        return Promise.resolve(AutoSaveResult.FAILED)
      if (override) {
        setAutoSavePossible(true)
        setErrorCount(0)
      }
      try {
        const { created_at, ...rest } = content
        const response = await fetch(
          `${API_BASE_URL}/news/${slug}?language=${language_code}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              ...rest,
              last_updated: new Date().toISOString(),
            }),
          }
        )

        if (!response.ok) {
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

        const updatedData = (await response.json()) as News
        mutate(
          `${API_BASE_URL}/news/${slug}?language=${language_code}`,
          updatedData,
          false
        )
        setAutoSavePossible(false)
        setErrorCount(0)
        return AutoSaveResult.SUCCESS
      } catch (error) {
        console.error(error)
        return AutoSaveResult.FAILED
      }
    },
    [autoSavePossible, errorCount, slug, content]
  )

  const updateContent = useCallback((newContent: News) => {
    setContent(newContent)
  }, [])

  const addNotification = useCallback((message: string) => {
    setNotification(message)

    setTimeout(() => {
      setNotification((prevNotification) =>
        prevNotification === message ? '' : prevNotification
      )
    }, 5000)
  }, [])

  const switchCurrentLanguage = useCallback((newLanguage: LanguageCode) => {
    setCurrentLanguage(newLanguage)
  }, [])

  useEffect(() => {
    setInterval(() => {
      setAutoSavePossible(true)
    }, 1000 * 30)
  }, [])

  return (
    <AutoSaveContext.Provider
      value={{
        content,
        updateContent,
        autoSavePossible,
        saveCallback,
        notifications: notification,
        addNotification,
        currentLanguage,
        switchCurrentLanguage,
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
