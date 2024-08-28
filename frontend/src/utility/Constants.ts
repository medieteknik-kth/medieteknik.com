import { Language } from '@/models/Language'

export const API_BASE_URL: string = 'http://localhost:8000/api/v1'

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