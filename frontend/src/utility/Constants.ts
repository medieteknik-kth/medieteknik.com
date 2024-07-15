export const API_BASE_URL: string = 'http://localhost:8000/api/v1'

export type LanguageCodes = 'sv' | 'en'

export interface Language {
  code: LanguageCodes
  name: string
}

export const LANGUAGES: Language[] = [
  {
    code: 'sv',
    name: 'Svenska',
  },
  {
    code: 'en',
    name: 'English',
  },
]