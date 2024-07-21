'use client'
import { useTranslation } from '@/app/i18n/client'
import Guest from '../Guest'
import NotificationMenu from '../Notification'
import OptionsMenu from '../Options'
import UserLoggedIn from './LoggedIn'
import { useAuthentication } from '@/providers/AuthenticationProvider'

/**
 * LoginSection
 * @description Renders the display for guest or non-authenticated users and logged in users
 *
 * @param {string} language - The language of the current page
 * @returns {JSX.Element} The login section
 */
export default function LoginSection({
  language,
}: {
  language: string
}): JSX.Element {
  const { t } = useTranslation(language, 'header')
  const { student, logout } = useAuthentication()

  return (
    <div className='w-fit xl:w-[500px] h-full '>
      {student ? (
        <div className='w-fit xl:w-full h-full flex relative gap-1 lg:gap-4'>
          <NotificationMenu language={language} />
          <UserLoggedIn t={t} student={student} logout={logout} />
        </div>
      ) : (
        <div className='w-fit xl:w-full h-full flex relative gap-1 lg:gap-4'>
          <OptionsMenu language={language} />
          <Guest t={t} />
        </div>
      )}
    </div>
  )
}
