// hooks/useMovementDetection.ts
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';

export const useMovementDetection = (checkInterval = 15000) => {
  const [movementDetected, setMovementDetected] = useState(false);

  useEffect(() => {
    const distanceRef = ref(database, 'sensorData/distance');
    
    const checkMovement = () => {
      onValue(distanceRef, (snapshot) => {
        const distance = snapshot.val();
        setMovementDetected(distance>0);
      });
    };

    //inital checking
    checkMovement();
    
  //periodic check
    const interval = setInterval(checkMovement, checkInterval);
    
    return () => {
      clearInterval(interval);
    };
  }, [checkInterval]);

  return movementDetected;
};