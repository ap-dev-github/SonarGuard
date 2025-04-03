export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // AWS
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;
      NEXT_PUBLIC_COGNITO_CLIENT_ID: string;
      NEXT_PUBLIC_AWS_REGION: string;
      COGNITO_ISSUER:string;
      
      // Database
     MONGO_URI: string;
     DB_NAME: string;
      
      // Firebase
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_DATABASE_URL: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      
      // EmailJS
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: string;
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: string;
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: string;
    }
  }
}