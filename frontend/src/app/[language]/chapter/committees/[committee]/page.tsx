import { Metadata, ResolvingMetadata } from 'next'
import CommitteePage from './committee'

interface Params {
  language: string
  committee: string
}

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params
  const value = decodeURI(params.committee)

  return {
    title: value.toUpperCase(),
  }
}

export default CommitteePage
