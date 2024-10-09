import AllNews from './allNews'
import { News } from '@/models/Items'
import { GetNewsPagniation } from '@/api/items'

export const revalidate = 43_200 // 12 hours

export default async function NewsPage({
  params: { language },
}: {
  params: { language: string }
}) {
  const data = await GetNewsPagniation(language, 1)
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
