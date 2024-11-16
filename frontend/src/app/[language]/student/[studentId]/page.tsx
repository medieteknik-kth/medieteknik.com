import { GetStudentPublic } from '@/api/student'
import { useTranslation } from '@/app/i18n'
import { LanguageCode } from '@/models/Language'
import { Metadata } from 'next'
import StudentPage from './student'

interface Params {
  language: LanguageCode
  studentId: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'student/student')
  const data = await GetStudentPublic(params.studentId, params.language, true)

  if (!data) return {}

  const maxWords = 30
  const fullName =
    data.student.first_name + ' ' + (data.student.last_name || '')
  const value = fullName.split(' ').slice(0, maxWords).join(' ')

  return {
    title: value,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/student/${params.studentId}`,
      languages: {
        sv: `https://www.medieteknik.com/sv/student/${params.studentId}`,
        en: `https://www.medieteknik.com/en/privacy`,
        'x-default': `https://www.medieteknik.com/student/${params.studentId}`,
      },
    },
  }
}

export default StudentPage
