import { CognitoUserPool } from "amazon-cognito-identity-js";
const poolData = {
  UserPoolId:process.env.NEXT_APP_COGNITO_USER_POOL_ID||"",
  ClientId:process.env.NEXT_APP_COGNITO_CLIENT_ID||"",
};
//add the console check for the above two env variables
export const userPool = new CognitoUserPool(poolData);

