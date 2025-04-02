'use client';
import { useEffect, useState } from 'react';
import { useMembers } from '@/contexts/MemberContext';
import { useMovementDetection } from '@/hooks/useMovementDetection';
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from 'framer-motion';

export default function MovementAlert() {
  const { members } = useMembers();
  const { movementDetected, distance } = useMovementDetection(15000);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error"}|null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [isSystemOn, setIsSystemOn] = useState(false);

  const handleToggle = () => {
    setIsSystemOn(!isSystemOn);
    console.log('System status:', !isSystemOn ? 'ON' : 'OFF');
  };

  const showAlert = (message:string, type:"success"|"error") => {
    setAlert({message, type});
    if(type === "success"){
      setTimeout(() => setAlert(null), 3000);
    }
  };

  useEffect(() => {
    if (movementDetected && isSystemOn && !notificationSent && members.length > 0) {
      const sendAlert = async () => {
        try {
          emailjs.init({
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          });

          const params = {
            email: members.join(","),
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
          };

          const response = await emailjs.send(
            "service_n7ca8z3",
            "template_dezj0db",
            params
          );

          if (response.status === 200) {
            setNotificationSent(true);
            showAlert("Notification sent successfully!", "success");
          } else {
            showAlert("Notification sending failed!", "error");
          }
        } catch (err) {
          console.error('Alert sending failed:', err);
          showAlert("Notification sending failed!", "error");
        }
      };
      sendAlert();
    } else if (!movementDetected && notificationSent) {
      setNotificationSent(false);
    }
  }, [movementDetected, notificationSent, members, isSystemOn]);

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white dark:bg-gray-300 transition-all duration-300">
      {/* System Status Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Security System</h2>
        <div className="flex items-center gap-4">
          <span className={`font-medium ${!isSystemOn ? 'text-gray-500' : 'text-gray-400'}`}>
            OFF
          </span>
          <button
            type="button"
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              isSystemOn ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={handleToggle}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                isSystemOn ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`font-medium ${isSystemOn ? 'text-blue-600' : 'text-gray-400'}`}>
            ON
          </span>
        </div>
      </div>

      {/* Movement Detection Display */}
      <div className="relative">
        <AnimatePresence>
          {movementDetected && isSystemOn ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="mb-4"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-red-500 rounded-lg blur opacity-75 animate-pulse"></div>
                <div className="relative p-4 bg-red-600 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">ALERT!</h3>
                        <p className="text-white">Movement detected at {distance} cm</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow"
            >
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">All clear - No movement detected</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alert Notifications */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`mt-4 p-3 rounded-lg ${
              alert.type === "success" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            <div className="flex items-center">
              {alert.type === "success" ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{alert.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}