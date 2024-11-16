import News from '@/models/items/News'
import { LanguageCode } from '@/models/Language'

interface Props {
  news_data: News
  language: LanguageCode
}

export default function ArticleDate({ news_data, language }: Props) {
  return (
    <div className='flex items-center gap-2 mt-1 text-sm text-muted-foreground'>
      <p>
        <span>Published </span>
        <time dateTime={new Date(news_data.created_at).toDateString()}>
          {new Date(news_data.created_at).toLocaleDateString(language, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'CET',
            timeZoneName: 'longOffset',
          })}
        </time>
      </p>

      {news_data.last_updated &&
        new Date(news_data.last_updated).getTime() ===
          new Date(news_data.created_at).getTime() && (
          <p className='text-sm'>
            <span className='font-bold'>Last updated: </span>
            <time dateTime={new Date(news_data.last_updated).toDateString()}>
              {new Date(news_data.last_updated).toLocaleDateString(language, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </p>
        )}
    </div>
  )
}
