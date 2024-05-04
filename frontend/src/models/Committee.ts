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
export interface Committee {
  name: string;
  email: string;
  logo_url?: string;
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