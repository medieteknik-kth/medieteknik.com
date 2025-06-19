'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function changeLanguage(
  newLanguage: string,
  currentRoute: string
) {
  const cookieStore = await cookies()

  cookieStore.set('language', newLanguage)

  redirect(currentRoute.replace(/^\/[a-z]{2}/, `/${newLanguage}`))
}
