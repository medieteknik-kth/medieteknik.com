import { Language } from '@/models/Language'

export const API_BASE_URL: string =  process.env.NODE_ENV === 'development' 
  ? 'http://localhost:80/api/v1' // http://localhost:80/api/v1
  : 'https://api.medieteknik.com/api/v1'

export const LANGUAGES: Language = {
  'sv': {
    name: 'Svenska',
    flag: 'se',
  },
  'en': {
    name: 'English',
    flag: 'gb',
  },
}