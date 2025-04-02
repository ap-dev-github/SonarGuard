'use client';
import { useEffect, useState } from 'react';
import { useMembers } from '@/contexts/MemberContext';
import { useMovementDetection } from '@/hooks/useMovementDetection';
import emailjs from "@emailjs/browser"

export default function MovementAlert() {
  const { members } = useMembers();
  const movementDetected = useMovementDetection(15000); // Check every 40 seconds
  const [notificationSent, setNotificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (movementDetected&& !notificationSent  && members.length > 0) {
        //Function to send the email notification 
      const sendAlert = async () => {
        console.log("List of the email in the members",members);
        try {
          emailjs.init({
            publicKey:process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          });

        //Send Email to all of the people 
       const Notification = async() => {
        const params = {email: members.join(","),}
        return emailjs.send(
          "service_n7ca8z3","template_dezj0db",params);
  
       }
         
   

          const response = await Notification();

          if (response.status === 200){
            setNotificationSent(true);
            console.log("Notification sent successfully to all recipients!");
          } else {
            console.log("Notification sending failed!");
          }
        } catch (err) {
          
          console.error('Alert sending failed:', err);
        }
      };
      sendAlert();

    } else if (!movementDetected && notificationSent) {
      setNotificationSent(false);
    }
  }, [movementDetected, notificationSent, members]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Security System Status</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-4 h-4 rounded-full ${movementDetected ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
        <span className={`text-xl ${movementDetected ? 'text-red-500' : 'text-green-500'}`}>
          {movementDetected ? 'Movement Detected!' : 'No Movement'}
        </span>
      </div>
      

    </div>
  );
}