import { gql } from "apollo-boost";

export const PHONE_SIGN_IN = gql`
  mutation StartPhoneVerification($phoneNumber: String!) {
    StartPhoneVerification(phoneNumber: $phoneNumber) {
      ok
      error
    }
  }
`;
