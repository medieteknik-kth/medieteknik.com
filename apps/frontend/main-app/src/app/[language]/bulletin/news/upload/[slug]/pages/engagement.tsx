import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function EngagementPage() {
  // TODO: Add engagement metrics
  return (
    <section className='w-full h-full min-h-[1080px] flex flex-col relative ml-24 pt-8'>
      <div>
        <h1 className='text-4xl'>Article Metrics</h1>
      </div>
      <div className='w-2/3 h-[800px] my-10 bg-black/10 dark:bg-white/10 backdrop-blur-3xl rounded grid place-items-center'>
        <ExclamationTriangleIcon className='w-32 h-32 text-red-600' />
        <h2 className='text-2xl -mt-44'>
          You can only view this page after publishing
        </h2>
      </div>
    </section>
  )
}
