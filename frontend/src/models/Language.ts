export type LanguageCode = 'sv' | 'en'

import { JSX } from 'react'

interface LanguageDetails {
  short_name: string
  name: string
  flag: string
  flag_icon: JSX.Element
}

export type Language = {
  [key in LanguageCode]: LanguageDetails
}
