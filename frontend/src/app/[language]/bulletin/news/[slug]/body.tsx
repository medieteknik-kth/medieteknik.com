'use client'
import { SlateDisplay } from '../upload/[slug]/util/Text'

export default function Body({ body }: { body: string }) {
  return <SlateDisplay value={JSON.parse(body)} />
}
