import type { LanguageCode } from '@medieteknik/models/src/util/Language'
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
