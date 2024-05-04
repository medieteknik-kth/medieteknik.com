import Base from './base'

export default function Account({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main className='relative'>
      <div className='h-24 bg-black' />
      <Base params={{ language }} />
    </main>
  )
}
