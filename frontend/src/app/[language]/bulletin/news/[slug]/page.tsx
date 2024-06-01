import Committee, { CommitteePosition } from '@/models/Committee'
import News from '@/models/Items'
import Student from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import Body from './body'
import StudentTag from '@/components/tags/Student'

interface Props {
  author: Student | Committee | CommitteePosition
  news: News
}

async function getData(language_code: string, slug: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/${slug}?language_code=${language_code}`
    )

    if (response.ok) {
      const data = await response.json()
      const temp = { ...data }
      delete temp.author
      const news = temp
      return {
        author: {
          ...data.author,
          type: data.author.author_type,
        },
        news: news,
      } as Props
    }
  } catch (error) {
    console.error(error)
  }
}

function assignCorrectAuthor(
  author: Student | Committee | CommitteePosition
): Student | Committee | CommitteePosition | null {
  if (author.type === 'STUDENT') {
    return author as Student
  } else if (author.type === 'COMMITTEE') {
    return author as Committee
  } else if (author.type === 'COMMITTEE_POSITION') {
    return author as CommitteePosition
  }

  return null
}

export default async function NewsPage({
  params: { language, slug },
}: {
  params: { language: string; slug: string }
}) {
  const data = await getData(language, slug)

  if (!data) {
    return <div>Not found</div>
  }

  const { author, news } = data

  let correctedAuthor = assignCorrectAuthor(author)
  if (!correctedAuthor) {
    return <div>Not found</div>
  }

  return (
    <main>
      <div className='h-24' />
      <div className='px-96 h-[1080px]'>
        <div>
          <ul className='flex min-h-20 h-fit'>
            {news.categories &&
              news.categories.map((category) => (
                <li className='px-4 py-2' key={category}>
                  {category}
                </li>
              ))}
          </ul>
          <h1 className='text-4xl'>{news.title}</h1>
          <h2 className='text-lg my-2'>
            {correctedAuthor && (
              <StudentTag
                language={language}
                student={correctedAuthor as Student}
                includeAt={false}
              />
            )}
          </h2>
          <p className='text-sm mt-4'>{news.created_at}</p>
        </div>
        <div>
          <Body body={news.body} />
        </div>
      </div>
    </main>
  )
}
