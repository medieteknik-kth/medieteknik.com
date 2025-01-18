'use client'

import { SlateDisplay } from '@/app/[language]/bulletin/news/upload/[slug]/util/Text'

import type { JSX } from 'react'

interface Props {
  body: string
}

/**
 * @name Body
 * @description The component that renders the body of the article
 *
 * @param {Props} props
 * @param {string} props.body - The body of the article
 *
 * @returns {JSX.Element} The body of the article
 */
export default function Body({ body }: Props): JSX.Element {
  return <SlateDisplay value={JSON.parse(body)} />
}
