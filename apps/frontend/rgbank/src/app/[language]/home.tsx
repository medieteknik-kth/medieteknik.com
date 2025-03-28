import { getAllCommittees } from '@/api/committee'
import UploadForm from '@/app/[language]/upload/form'
import HeaderGap from '@/components/header/components/HeaderGap'

export default async function Home() {
  const { data: committees, error } = await getAllCommittees('en', 0)
  if (error) {
    return (
      <div>
        Error loading committees <br />
        <span>{error.name}</span> <br />
        <span>{error.message}</span>
      </div>
    )
  }

  return (
    <main className='bg-neutral-100'>
      <HeaderGap />
      <div className='container my-4'>
        <UploadForm committees={committees} />
      </div>
      <div className='bg-white border-t-2 border-black py-8'>
        <div className='container'>
          <h1 className='text-3xl font-bold'>Information</h1>
          <br />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum
            velit cum explicabo nesciunt expedita itaque hic dolores. Deleniti
            unde vitae fugiat nesciunt atque! Voluptate provident fugiat nobis
            magni quas amet?
          </p>
        </div>
      </div>
    </main>
  )
}
