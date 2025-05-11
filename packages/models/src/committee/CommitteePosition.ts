import type { LanguageCode } from '../util/Language'
import type { Committee } from './Committee'
import type { CommitteePositionCategory } from './CommitteeCategory'

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
  committee_position_id: string
  author_type: 'COMMITTEE_POSITION'
  email?: string
  role: 'ADMIN' | 'BOARD' | 'COMMITTEE'
  active: boolean
  weight: number
  base: boolean
  category: CommitteePositionCategory
  committee?: Committee
  translations: CommitteePositionTranslation[]
}

export interface CommitteePositionTranslation {
  title: string
  description: string
  language_code: LanguageCode
}

export interface CommitteePositionRecruitment {
  committee_position: CommitteePosition
  start_date: string
  end_date: string
  translations: [
    {
      description: string
      link_url: string
    },
  ]
}
