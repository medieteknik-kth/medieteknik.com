import type { Language } from '@/models/Language'
import { GB, SE } from 'country-flag-icons/react/3x2'

export const API_BASE_URL: string =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:80/api/v1' // http://localhost:80/api/v1
    : 'https://api.medieteknik.com/api/v1'

export const LANGUAGES: Language = {
  sv: {
    short_name: 'sv',
    name: 'Svenska',
    flag_icon: (
      <SE
        style={{
          width: 'inherit',
          height: 'inherit',
        }}
      />
    ),
  },
  en: {
    short_name: 'en',
    name: 'English',
    flag_icon: (
      <GB
        style={{
          width: 'inherit',
          height: 'inherit',
        }}
      />
    ),
  },
}
