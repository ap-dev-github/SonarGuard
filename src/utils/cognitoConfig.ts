import { CognitoUserPool } from "amazon-cognito-identity-js";
const poolData = {
  UserPoolId: "ap-south-1_NVOTctJBy",
  ClientId: "6qipdfbmr83h8p5oepb9pmq6er" 
};


//add the console check for the above two env variables
export const userPool = new CognitoUserPool(poolData);
