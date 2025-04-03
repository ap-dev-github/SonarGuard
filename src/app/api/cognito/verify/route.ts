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
    const { email, otp } = await request.json();

    
    // Ensure environment variable is set
    const clientId = process.env.COGNITO_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Properly typed params object
    const params: AWS.CognitoIdentityServiceProvider.ConfirmSignUpRequest = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: otp,
    };


    const data = await cognito.confirmSignUp(params).promise();
    return NextResponse.json({ 
      success: true, 
      message: 'Verification successful! You can now login.',
      data 
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Verification failed', code: error.code },
      { status: 400 }
    );
  }
}