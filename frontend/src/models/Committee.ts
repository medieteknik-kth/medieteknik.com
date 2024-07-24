import { LanguageCodes } from '@/utility/Constants';

/**
 * @interface CommitteeCategory
 * @description Committee category model
 * 
 * @param {string} title - Committee category title
 * @param {string} email - Committee category email
 */
export interface CommitteeCategory {
  email?: string;
  translations: CommitteeCategoryTranslation[];
}

export interface CommitteeCategoryTranslation {
  title: string
  language_code: LanguageCodes;
}

export type CommitteePositionCategory = 'STYRELSEN' | 'VALBEREDNINGEN' | 'STUDIENÄMNDEN' | 'NÄRINGSLIV OCH KOMMUNIKATION' | 'STUDIESOCIALT' | 'FANBORGEN';

/**
 * @interface Committee
 * @description Committee model
 * 
 * @param {string} name - Committee name
 * @param {string} email - Committee email
 * @param {string} logo_url - Committee logo URL (optional)
 */
export default interface Committee {
  author_type: 'COMMITTEE';
  email: string;
  group_photo_url?: string;
  logo_url: string;
  translations: CommitteeTranslation[];
}

export interface CommitteeTranslation {
  title: string;
  description: string;
  language_code: LanguageCodes;
}

/**
 * @interface CommitteePosition
 * @description Committee position model
 * 
 * @param {string} email - Committee position email
 * @param {string} title - Committee position title
 * @param {string} description - Committee position description
 * @param {'ADMIN' | 'BOARD' | 'COMMITTEE'} role - Committee position role
 * @param {boolean} active - Whether the position is active or not
 * @param {number} weight - Committee position weight
 */
export interface CommitteePosition {
  author_type: 'COMMITTEE_POSITION';
  email: string,
  role: 'ADMIN' | 'BOARD' | 'COMMITTEE';
  active: boolean;
  weight: number;
  category: CommitteePositionCategory;
  committee_logo_url?: string;
  translations: CommitteePositionTranslation[]
}

export interface CommitteePositionTranslation {
  title: string;
  description: string;
  language_code: LanguageCodes;
}
