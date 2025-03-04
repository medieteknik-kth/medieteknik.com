'use client'

import Loading from '@/components/tooltips/Loading'
import type { LanguageCode } from '@/models/Language'
import React, { Suspense, useEffect, useRef, useState, type JSX } from 'react'

const ExtraNews = React.lazy(() => import('./extranews'))

interface Props {
  language: LanguageCode
}

/**
 * @name ExtraNewsObserver
 * @description Renders the extra news component when the user scrolls to the bottom of the page.
 *
 * @param {Props} props - The props of the component.
 * @param {string} props.language - The language code of the news pages to render.
 *
 * @returns {JSX.Element} The JSX representation of the Extra News component.
 */
export default function ExtraNewsObserver({ language }: Props): JSX.Element {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const current = ref.current
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

    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [])
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
