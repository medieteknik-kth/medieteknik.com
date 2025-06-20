import type { LanguageCode } from '@/models/Language'
import type { Notification } from '@/models/Notification'
import Image from 'next/image'
import FallbackImage from 'public/images/logo.webp'

function getRelativeTime(date: Date, language: LanguageCode) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diff / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInSeconds < 60) {
    return language === 'sv'
      ? `${diffInSeconds} sekunder sedan`
      : `${diffInSeconds} seconds ago`
  }
  if (diffInMinutes < 60) {
    return language === 'sv'
      ? `${diffInMinutes} minuter sedan`
      : `${diffInMinutes} minutes ago`
  }
  if (diffInHours < 24) {
    return language === 'sv'
      ? `${diffInHours} timmar sedan`
      : `${diffInHours} hours ago`
  }
  if (diffInDays < 30) {
    return language === 'sv'
      ? `${diffInDays} dagar sedan`
      : `${diffInDays} days ago`
  }
  if (diffInMonths < 12) {
    return language === 'sv'
      ? `${diffInMonths} månader sedan`
      : `${diffInMonths} months ago`
  }
  return language === 'sv'
    ? `${date.toLocaleDateString('sv-SE')}`
    : `${date.toLocaleDateString('en-US')}`
}

interface Props {
  notification: Notification
  language: LanguageCode
}

export function NotificationContent({ notification, language }: Props) {
  return (
    <>
      <div className='bg-white w-10 sm:w-fit p-1 rounded-lg relative'>
        <Image
          src={notification.committee?.logo_url || FallbackImage}
          alt={notification.translations[0].title}
          width={40}
          height={40}
          className='object-cover'
          unoptimized={!notification.committee?.logo_url}
        />
      </div>
      <div className='flex flex-col gap-1 h-fit'>
        <div>
          <p className='text-xs mb-0.5'>
            {notification.notification_type === 'announcement' && (
              <span className='px-2 py-0.5 border rounded-xl border-neutral-600 text-neutral-600 bg-neutral-600/10 dark:border-neutral-500 dark:text-neutral-500 dark:bg-neutral-500/25'>
                {language === 'sv' ? 'Meddelande' : 'Announcement'}
              </span>
            )}
            {notification.notification_type === 'update' && (
              <span className='px-2 py-0.5 border rounded-xl border-emerald-600 text-emerald-600 bg-emerald-600/10 dark:border-emerald-500 dark:text-emerald-500 dark:bg-emerald-500/25'>
                {language === 'sv' ? 'Uppdatering' : 'Update'}
              </span>
            )}
            {notification.notification_type === 'news' && (
              <span className='px-2 py-0.5 border rounded-xl border-blue-600 text-blue-600 bg-blue-600/10 dark:border-blue-500 dark:text-blue-500 dark:bg-blue-500/25'>
                {language === 'sv' ? 'Nyhet' : 'News'}
              </span>
            )}
            {notification.notification_type === 'event' && (
              <span className='px-2 py-0.5 border rounded-xl border-red-600 text-red-600 bg-red-600/10 dark:border-red-500 dark:text-red-500 dark:bg-red-500/25'>
                {language === 'sv' ? 'Event' : 'Event'}
              </span>
            )}
          </p>
          <p className='sm:text-lg font-semibold tracking-tight'>
            {notification.translations[0].title}
          </p>
          {notification.metadata?.event_start_date &&
            notification.metadata?.event_location && (
              <p className='text-xs break-all text-muted-foreground'>
                <span>
                  {new Date(
                    notification.metadata.event_start_date
                  ).toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className='mx-1'>&bull;</span>
                <a
                  href={`https://www.kth.se/places/room/${notification.metadata.event_location}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {notification.metadata.event_location}
                </a>
              </p>
            )}
        </div>
        <div className='flex items-center justify-between'>
          {notification.committee && (
            <p className='text-xs text-muted-foreground'>
              By <span>{notification.committee.translations[0].title}</span>
            </p>
          )}
          <p className='text-xs text-muted-foreground'>
            {getRelativeTime(new Date(notification.created_at), language)}
          </p>
        </div>
      </div>
    </>
  )
}
