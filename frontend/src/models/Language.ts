import { JSX } from 'react'

/**
 * @type LanguageCode
 * @description The language codes used in the application
 *
 * @property {string} sv - Swedish
 * @property {string} en - English
 */
export type LanguageCode = 'sv' | 'en'

/**
 * @interface LanguageDetails
 * @description Holds the details of each language
 *
 * @property {string} short_name - The short name of the language
 * @property {string} name - The name of the language
 * @property {JSX.Element} flag_icon - The flag icon of the language
 */
interface LanguageDetails {
  short_name: string
  name: string
  flag_icon: JSX.Element
}

/**
 * @type Language
 * @description The languages used in the application, an object with the language code as key and the details as value
 *
 * @property {LanguageCode} sv - Swedish
 * @property {LanguageCode} en - English
 * @property {LanguageCode.<LanguageDetails>} LanguageCode - The details of each language
 */
export type Language = {
  [key in LanguageCode]: LanguageDetails
}
