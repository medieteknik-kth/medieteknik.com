import { Language } from '@/models/Language'

export const API_BASE_URL: string =  'https://api.medieteknik.com/api/v1'

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