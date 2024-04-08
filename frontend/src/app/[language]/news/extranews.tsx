export default function ExtraNews() {
  return (
    <section className='w-full h-[1080px] px-12'>
      <h2 className='text-3xl uppercase'>More News</h2>
      <div className='w-full h-4/5 grid grid-cols-3 grid-rows-2 gap-8'>
        <div className='bg-sky-400 col-span-2'></div>
        <div className='bg-emerald-400'></div>
        <div className='bg-purple-400'></div>
        <div className='bg-red-400 col-span-2'></div>
      </div>
    </section>
  )
}
