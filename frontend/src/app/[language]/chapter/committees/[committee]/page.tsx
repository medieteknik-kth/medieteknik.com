import { Metadata, ResolvingMetadata } from 'next'
import Committee from './committee'

interface Params {
  language: string
  committee: string
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const value = decodeURI(params.committee)

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default Committee
