import type {
  FailedAuthenticationResponse,
  SuccessfulAuthenticationResponse,
} from '@medieteknik/models'

export type AuthenticationResponse =
  | SuccessfulAuthenticationResponse
  | FailedAuthenticationResponse
