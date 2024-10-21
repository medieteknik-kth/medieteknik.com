import { LanguageCode } from './Language';

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
  language_code: LanguageCode;
}

export type CommitteePositionCategory = 'STYRELSEN' | 'VALBEREDNINGEN' | 'UTBILDNING' | 'NÄRINGSLIV OCH KOMMUNIKATION' | 'STUDIESOCIALT' | 'FANBORGEN' | 'NONE';

/**
 * @interface Committee
 * @description Committee model
 * 
 * @param {string} name - Committee name
 * @param {string} email - Committee email
 * @param {string} logo_url - Committee logo URL (optional)
 */
export default interface Committee {
  committee_id: string;
  author_type: 'COMMITTEE';
  email: string;
  group_photo_url?: string;
  logo_url: string;
  total_documents: number;
  total_events: number;
  total_media: number;
  total_news: number;
  hidden: boolean;
  translations: CommitteeTranslation[];
}

export interface CommitteeTranslation {
  title: string;
  description: string;
  language_code: LanguageCode;
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
  committee_position_id: string;
  author_type: 'COMMITTEE_POSITION';
  email?: string,
  role: 'ADMIN' | 'BOARD' | 'COMMITTEE';
  active: boolean;
  weight: number;
  base: boolean;
  category: CommitteePositionCategory;
  committee?: Committee;
  translations: CommitteePositionTranslation[]
}

export interface CommitteePositionTranslation {
  title: string;
  description: string;
  language_code: LanguageCode;
}

export interface CommitteePositionRecruitment {
  committee_position: CommitteePosition;
  start_date: string;
  end_date: string;
  translations: [
    {
      description: string;
      link_url: string;
    }
  ]
}
