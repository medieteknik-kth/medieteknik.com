import { getPublicCommitteeData } from '@/api/committee'
import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'
import CommitteeRedirect from './redirect'

interface Params {
  language: LanguageCode
  committee: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name CommitteeManage
 * @description The page for managing a committee
 *
 * @param {object} param - The dynamic URL parameters
 * @param {string} param.language - The language of the page
 * @param {string} param.committee - The committee name to manage
 *
 * @returns {Promise<JSX.Element>} The rendered component
 */
export default async function CommitteeManage(
  props: Props
): Promise<JSX.Element> {
  const { language, committee } = await props.params
  const decodedCommittee = decodeURIComponent(committee)
  const { data: committeeData, error } =
    await getPublicCommitteeData(decodedCommittee)

  if (error) {
    return <p>Not Found!</p>
  }

  return (
    <main>
      <CommitteeRedirect
        language={language}
        committee={committee}
        committeeName={decodedCommittee}
        committeeData={committeeData}
      />
    </main>
  )
}
