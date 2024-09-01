export type LanguageCode = 'sv' | 'en'

interface LanguageDetails {
  name: string;
  flag: string;
}

export type Language = {
  [key in LanguageCode]: LanguageDetails;
};