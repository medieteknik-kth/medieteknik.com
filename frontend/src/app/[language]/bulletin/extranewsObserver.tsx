'use client'
import Loading from '@/components/tooltips/Loading'
import React, { Suspense, useEffect, useRef, useState } from 'react'

const ExtraNews = React.lazy(() => import('./extranews'))

/**
 * @name ExtraNewsObserver
 * @description Renders the extra news component when the user scrolls to the bottom of the page.
 *
 * @param {string} language - The language code of the news pages to render.
 * @returns {JSX.Element} The JSX representation of the Extra News component.
 */
export default function ExtraNewsObserver({
  language,
}: {
  language: string
}): JSX.Element {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.3,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref])
  return (
    <div ref={ref}>
      {isIntersecting && (
        <Suspense fallback={<Loading language={language} />}>
          <ExtraNews language={language} />
        </Suspense>
      )}
    </div>
  )
}
