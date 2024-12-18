import { LanguageCode } from '@/models/Language'
import { Metadata } from 'next'
import Profile from './profile'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  return {
    robots: 'noindex, nofollow',
  }
}

export default Profile
