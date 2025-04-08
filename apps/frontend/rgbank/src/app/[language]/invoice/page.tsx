import type { LanguageCode } from '@/models/Language'
import { redirect } from 'next/navigation'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function ExpensePage(props: Props) {
  const { language } = await props.params
  redirect(`/${language}`)
}
