import { getStudentPublic } from '@/api/student'
import StudentPositions from '@/app/[language]/student/[studentId]/client/positionsTab'
import StudentInfo from '@/app/[language]/student/[studentId]/info'
import HeaderGap from '@/components/header/components/HeaderGap'
import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
  studentId: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name StudentPage
 * @description The student page, displaying the student's information and positions
 *
 * @param {Props} props - The props
 * @param {Promise<Params>} props.params - The dynamic route parameters
 * @param {LanguageCode} props.params.language - The language code
 * @param {string} props.params.studentId - The student ID
 * @returns {Promise<JSX.Element>} The student page
 */
export default async function StudentPage(props: Props): Promise<JSX.Element> {
  const { language, studentId } = await props.params
  const { data, error } = await getStudentPublic(studentId, language, true)
  if (error) return <></>

  return (
    <main>
      <section className='h-fit bg-[#EEE] dark:bg-[#222] border-b-4 border-yellow-400 flex flex-col absolute w-full top-0 left-0 pb-44'>
        <HeaderGap />
      </section>

      <StudentInfo student={data.student} profile={data.profile} />

      <StudentPositions language={language} positions={data.memberships} />
    </main>
  )
}
