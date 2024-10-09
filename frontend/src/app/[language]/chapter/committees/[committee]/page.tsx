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

  return {
    title: value.toUpperCase(),
  }
}

export default Committee
