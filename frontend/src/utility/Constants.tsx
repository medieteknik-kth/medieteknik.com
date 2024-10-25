import { Language } from '@/models/Language'
import { GB, SE } from 'country-flag-icons/react/3x2'

export const API_BASE_URL: string =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1' // http://localhost:80/api/v1
    : 'https://api.medieteknik.com/api/v1'

export const LANGUAGES: Language = {
  sv: {
    name: 'Svenska',
    flag: 'se',
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
    name: 'English',
    flag: 'gb',
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
