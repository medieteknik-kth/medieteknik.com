/**
 * @interface CommitteeCategory
 * @description Committee category model
 * 
 * @param {string} name - Committee category name
 * @param {string} email - Committee category email
 */
export interface CommitteeCategory {
  name: string;
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
  type: 'committee';
  name: string;
  email: string;
  logoUrl: string;
}

/**
 * @interface CommitteePosition
 * @description Committee position model
 * 
 * @param {string} name - Committee position name
 */
export interface CommitteePosition {
  name: string;
  description: string;
}

/**
 * @interface StudentCommitteePosition
 * @description Student committee position model
 * 
 * @param {Committee} committee - Committee
 * @param {CommitteePosition} position - Committee position
 * @param {string} initiatedDate - Initiated date
 * @param {string} endDate - Expected end date
 */
export interface StudentCommitteePosition {
  committee: Committee;
  position: CommitteePosition;
  initiatedDate: string;
  endDate: string;
}

