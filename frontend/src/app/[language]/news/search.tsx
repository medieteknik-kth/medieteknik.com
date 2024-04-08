import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  return (
    <section className='w-full h-20 my-10 grid place-items-center'>
      <div className='w-4/5 h-full relative'>
        <input
          type='search'
          className='w-full h-full rounded-xl shadow-sm shadow-gray-300 border-2 border-gray-300 pl-4 text-3xl uppercase'
          placeholder='Search'
        />
        <button
          className='w-fit h-full absolute top-0 right-20 grid place-items-center'
          title='Search all news'
          aria-label='Search Button for all news and events'
        >
          <MagnifyingGlassIcon className='w-10 h-10' />
        </button>
      </div>
    </section>
  )
}
