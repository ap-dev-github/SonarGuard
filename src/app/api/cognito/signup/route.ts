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
    const { email, password, name } = await request.json();

    // Validate environment variables
    if (!process.env.COGNITO_CLIENT_ID) {
        throw new Error('Cognito Client ID is not configured');
      } 
      
    const params: AWS.CognitoIdentityServiceProvider.SignUpRequest = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
        ],
      };
    const data = await cognito.signUp(params).promise();
    return NextResponse.json({ 
      success: true, 
      message: 'Signup successful! Please verify your email.',
      data 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Signup failed', code: error.code },
      { status: 400 }
    );
  }
}