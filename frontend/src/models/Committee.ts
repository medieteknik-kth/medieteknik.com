/**
 * @interface CommitteeCategory
 * @description Committee category model
 * 
 * @param {string} title - Committee category title
 * @param {string} email - Committee category email
 */
export interface CommitteeCategory {
  title: string;
  email: string;
}

/**
 * @interface Committee
 * @description Committee model
 * 
 * @param {string} name - Committee name
 * @param {string} email - Committee email
 * @param {string} logo_url - Committee logo URL (optional)
 */
export default interface Committee {
  type: 'COMMITTEE';
  title: string;
  description: string;
  email: string;
  logo_url: string;
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
  type: 'COMMITTEE_POSITION';
  email: string,
  title: string;
  description: string;
  role: 'ADMIN' | 'BOARD' | 'COMMITTEE';
  active: boolean;
  weight: number;
}
