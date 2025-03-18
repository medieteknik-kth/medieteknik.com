'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type News from '@/models/items/News'
import { useStudent } from '@/providers/AuthenticationProvider'
import { API_BASE_URL } from '@/utility/Constants'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  news_data: News
}

export default function NewsAuth({ language, news_data }: Props): JSX.Element {
  const { toast } = useToast()
  const { student, committees } = useStudent()
  const { t } = useTranslation(language, 'news')

  const deleteArticle = async () => {
    if (!news_data.url) {
      console.error('No URL found for article')
      return
    }
    const encodedURL = encodeURIComponent(news_data.url)
    try {
      const response = await fetch(`${API_BASE_URL}/news/${encodedURL}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast({
          title: 'Article deleted',
          description: 'The article was successfully deleted.',
          duration: 2500,
        })
        window.location.href = `/${language}/bulletin/news`
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred while deleting the article.',
          duration: 2500,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!student) {
    return <></>
  }

  if (news_data.author.author_type === 'COMMITTEE' && committees) {
    if (
      committees.some(
        (committee: Committee) =>
          committee.committee_id !==
          (news_data.author as Committee).committee_id
      )
    ) {
      return <></>
    }
  }

  return (
    <div className=''>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='w-full h-fit' variant={'destructive'}>
            {t('delete')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('delete_cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteArticle()
              }}
            >
              {t('delete_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
