'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    emailjs: any;
  }
}

export default function EmailServiceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load EmailJS script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    
    script.onload = () => {
      window.emailjs.init({
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      });
      console.log('EmailJS initialized');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}