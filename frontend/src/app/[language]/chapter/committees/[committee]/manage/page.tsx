import { Metadata, ResolvingMetadata } from 'next'
import CommitteeManage from './manage'

interface Params {
  language: string
  committee: string
}

export async function generateMetadata(props: { params: Promise<Params> }, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const value = decodeURI(params.committee)

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue + ' Management',
  }
}

export default CommitteeManage
