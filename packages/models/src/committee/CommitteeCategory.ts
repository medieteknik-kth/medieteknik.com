import type { LanguageCode } from '../util/Language'

/**
 * @interface CommitteeCategory
 * @description Committee category model
 *
 * @param {string} title - Committee category title
 * @param {string} email - Committee category email
 */
export interface CommitteeCategory {
  email?: string
  translations: CommitteeCategoryTranslation[]
}

export interface CommitteeCategoryTranslation {
  title: string
  language_code: LanguageCode
}

export type CommitteePositionCategory =
  | 'STYRELSEN'
  | 'STUDIESOCIALT'
  | 'NÄRINGSLIV OCH KOMMUNIKATION'
  | 'UTBILDNING'
  | 'VALBEREDNINGEN'
  | 'KÅRFULLMÄKTIGE'
  | 'REVISORER'
  | 'FANBORGEN'
  | 'NONE'
