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

    const params: AWS.CognitoIdentityServiceProvider.ResendConfirmationCodeRequest = {
        ClientId: process.env.COGNITO_CLIENT_ID!, // ClientId is required here
        Username: email,
      };

    const data = await cognito.resendConfirmationCode(params).promise();
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code resent! Check your email.',
      data 
    });
  } catch (error: any) {
    console.error('Resend error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to resend verification code', code: error.code },
      { status: 400 }
    );
  }
}