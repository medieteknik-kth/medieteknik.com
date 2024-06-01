import Committee, { CommitteePosition } from '@/models/Committee'
import News from '@/models/Items'
import Student from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import Body from './body'
import StudentTag from '@/components/tags/Student'

async function getData(language_code: string, slug: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/news/${slug}?language_code=${language_code}`
    )

    if (response.ok) {
      const data = await response.json()
      return data as News
    }
  } catch (error) {
    console.error(error)
  }
}

function assignCorrectAuthor(
  author: any
): Student | Committee | CommitteePosition | null {
  if (author.author_type === 'STUDENT') {
    return author as Student
  } else if (author.author_type === 'COMMITTEE') {
    return author as Committee
  } else if (author.author_type === 'COMMITTEE_POSITION') {
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

  let correctedAuthor = assignCorrectAuthor(data.author)
  if (!correctedAuthor) {
    return <div>Not found author</div>
  }

  return (
    <main>
      <div className='h-24' />
      <div className='px-96 h-[1080px]'>
        <div>
          <ul className='flex min-h-20 h-fit'>
            {data.categories &&
              data.categories.map((category) => (
                <li className='px-4 py-2' key={category}>
                  {category}
                </li>
              ))}
          </ul>
          <h1 className='text-4xl'>{data.title}</h1>
          <h2 className='text-lg my-2'>
            {correctedAuthor && (
              <StudentTag
                language={language}
                student={correctedAuthor as Student}
                includeAt={false}
              />
            )}
          </h2>
          <p className='text-sm mt-4'>{data.created_at}</p>
        </div>
        <div>
          <Body body={data.body} />
        </div>
      </div>
    </main>
  )
}
