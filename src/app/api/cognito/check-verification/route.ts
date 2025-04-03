import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cognito = new AWS.CognitoIdentityServiceProvider();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const params: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest  = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
    };

    const data = await cognito.adminGetUser(params).promise();
    const emailVerifiedAttr = data.UserAttributes?.find(attr => attr.Name === 'email_verified');
    const isVerified = emailVerifiedAttr?.Value === 'true';

    return NextResponse.json({ 
      success: true, 
      isVerified,
      data 
    });
  } catch (error: any) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to check verification status', code: error.code },
      { status: 400 }
    );
  }
}