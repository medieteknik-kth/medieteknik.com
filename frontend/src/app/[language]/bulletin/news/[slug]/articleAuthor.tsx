import { assignCorrectAuthor } from '@/app/[language]/bulletin/news/[slug]/util'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import Committee, { CommitteePosition } from '@/models/Committee'
import News from '@/models/items/News'
import { LanguageCode } from '@/models/Language'
import Student from '@/models/Student'

interface Props {
  news_data: News
  language: LanguageCode
}

export default function ArticleAuthor({ news_data, language }: Props) {
  const correctedAuthor = assignCorrectAuthor(news_data.author)
  if (!correctedAuthor) {
    return <div>Not found author</div>
  }
  return (
    <address className='text-base my-1 not-italic flex gap-2 items-center'>
      {correctedAuthor && correctedAuthor.author_type === 'STUDENT' ? (
        <div className='flex items-center gap-2'>
          <StudentTag student={correctedAuthor as Student} includeAt={false} />
        </div>
      ) : correctedAuthor.author_type === 'COMMITTEE' ? (
        <div className='flex items-center gap-2'>
          <CommitteeTag
            committee={correctedAuthor as Committee}
            includeAt={false}
            includeBackground={false}
          />
        </div>
      ) : (
        correctedAuthor.author_type === 'COMMITTEE_POSITION' && (
          <CommitteePositionTag
            committeePosition={correctedAuthor as CommitteePosition}
          />
        )
      )}
    </address>
  )
}
