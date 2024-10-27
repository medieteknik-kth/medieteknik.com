'use client'

import { useAuthentication } from '@/providers/AuthenticationProvider'
import Guest from './Guest'
import UserLoggedIn from './LoggedIn'
import NotificationMenu from './Notification'
import OptionsMenu from './Options'

import type { JSX } from 'react'

interface Props {
  language: string
}

/**
 * @name LoginSection
 * @description Renders the display for guest or non-authenticated users and logged in users
 *
 * @param {Props} props
 * @param {string} props.language - The language of the current page
 *
 * @returns {JSX.Element} The login section
 */
export default function LoginSection({ language }: Props): JSX.Element {
  const { student } = useAuthentication()

  return (
    <section className='w-fit xl:w-[400px] h-full flex relative gap-1 lg:gap-4'>
      {student ? (
        <>
          <NotificationMenu language={language} />
          <UserLoggedIn language={language} />
        </>
      ) : (
        <>
          <OptionsMenu language={language} />
          <Guest language={language} />
        </>
      )}
    </section>
  )
}
