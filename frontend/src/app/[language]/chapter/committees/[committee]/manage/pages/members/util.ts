import type { CommitteePosition } from '@/models/Committee'
import { Role } from '@/models/Permission'

/**
 * An object representing different weight/permission levels with their corresponding numeric values.
 * The weight levels are defined as constants.
 *
 * @constant
 * @type {object}
 * @property {number} HIGHEST - Represents the highest weight level with a value of 150.
 * @property {number} HIGH - Represents a high weight level with a value of 300.
 * @property {number} MEDIUM - Represents a medium weight level with a value of 400.
 * @property {number} LOW - Represents a low weight level with a value of 600.
 * @property {number} LOWEST - Represents the lowest weight level with a value of 800.
 */
export const WeightLevel = {
  HIGHEST: 150,
  HIGH: 300,
  MEDIUM: 400,
  LOW: 600,
  LOWEST: 800,
} as const

export type WeightLevel = (typeof WeightLevel)[keyof typeof WeightLevel]

/**
 * Finds a committee position by its ID from a list of committee positions.
 *
 * @param committeePositions - An array of committee positions.
 * @param committee_position_id - The ID of the committee position to find.
 * @returns The committee position with the specified ID, or undefined if not found.
 */
function findCommitteePosition(
  committeePositions: CommitteePosition[],
  committee_position_id: string
) {
  return committeePositions.find(
    (position) => position.committee_position_id === committee_position_id
  )
}

/**
 * Checks if a student meets the minimum weight requirement for a committee position.
 *
 * @param committeePositions - An array of all committee positions.
 * @param studentPositions - An array of the student's committee positions.
 * @param studentRole - The role of the student.
 * @param targetWeight - The minimum weight requirement to be met.
 * @returns `true` if the student meets the minimum weight requirement or is an admin, otherwise `false`.
 */
export function hasMinimumWeightRequirement(
  committeePositions: CommitteePosition[],
  studentPositions: CommitteePosition[],
  studentRole: Role,
  targetWeight: number
) {
  if (studentRole === Role.ADMIN) {
    return true
  }

  const positions = studentPositions.map((userPosition) =>
    findCommitteePosition(
      committeePositions,
      userPosition.committee_position_id
    )
  )

  if (!positions || positions.length === 0) {
    return false
  }

  return positions.some((position) => {
    if (!position) {
      return false
    }

    return targetWeight >= position.weight
  })
}
