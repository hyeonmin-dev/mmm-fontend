/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: meQuery
// ====================================================

export interface meQuery_me {
  __typename: "User";
  id: number;
  name: string;
  email: string;
  verified: boolean;
}

export interface meQuery {
  me: meQuery_me;
}