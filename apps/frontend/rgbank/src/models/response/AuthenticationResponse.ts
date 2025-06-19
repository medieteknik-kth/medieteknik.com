import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type {
  FailedAuthenticationResponse,
  SuccessfulAuthenticationResponse,
} from '@medieteknik/models/src/responses'

/**
 * Successful authentication response from the RGBank API.
 * @interface SuccessfulRGBankAuthenticationResponse
 * @extends SuccessfulAuthenticationResponse
 * @property {object} rgbank_permissions - Permissions for the RGBank API.
 * @property {number} rgbank_permissions.access_level - Access level for the RGBank API.
 * @property {number} rgbank_permissions.view_permission_level - View permission level for the RGBank API.
 * @property {object} rgbank_bank_account - Bank account information for the RGBank API.
 */
export interface SuccessfulRGBankAuthenticationResponse
  extends SuccessfulAuthenticationResponse {
  rgbank_permissions?: {
    access_level: number
    view_permission_level: number
  }
  rgbank_bank_account?: AccountBankInformation
}

/**
 * Type representing the authentication response from the RGBank API.
 * @@name AuthenticationResponse
 * @description This type is used to represent the authentication response from the RGBank API.
 * @property {SuccessfulRGBankAuthenticationResponse} SuccessfulRGBankAuthenticationResponse - Successful authentication response from the RGBank API.
 * @property {FailedAuthenticationResponse} FailedAuthenticationResponse - Failed authentication response from the RGBank API.
 */
export type AuthenticationResponse =
  | SuccessfulRGBankAuthenticationResponse
  | FailedAuthenticationResponse
