import AllNews from './allNews'
import { API_BASE_URL } from '@/utility/Constants'
import { News } from '@/models/Items'
import { NewsPagination } from '@/models/Pagination'

async function getNews(language: string) {
  const response = await fetch(
    `${API_BASE_URL}/public/news?language=${language}`
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
    return (
      <div className='h-96 grid place-items-center text-3xl'>No data...</div>
    )
  }

  data.items = data.items as News[]

  return (
    <main className='grid place-items-center'>
      <div className='h-24' />
      <h1 className='text-4xl py-10'>News</h1>
      <AllNews language={language} data={data} />
    </main>
  )
}
