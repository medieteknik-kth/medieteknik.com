import React from 'react'

const Content = React.lazy(() => import('./content/staticContent'))

export default function Static({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <section className='grow mx-20 px-10'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        Static Pages
      </h2>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Content />
      </React.Suspense>
    </section>
  )
}
