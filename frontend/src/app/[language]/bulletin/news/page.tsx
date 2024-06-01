import News, { NewsPagination } from '@/models/Items'
import AllNews from './allNews'
import { API_BASE_URL } from '@/utility/Constants'

async function getNews(language_code: string) {
  const response = await fetch(
    `${API_BASE_URL}/public/news?language_code=${language_code}`
  )
  if (response.ok) {
    const data = await response.json()
    return data as NewsPagination
  }
  console.error('Error fetching data:', response.statusText)
}

export default async function NewsPage({
  params: { language },
}: {
  params: { language: string }
}) {
  const data = await getNews(language)

  if (!data) {
    return <div>Not found</div>
  }

  data.items = data.items as News[]

  return (
    <main className='px-96'>
      <div className='h-24' />
      <h1 className='text-4xl py-10'>News</h1>
      <AllNews language={language} data={data} />
    </main>
  )
}
