// hooks/useMovementDetection.ts
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';

export const useMovementDetection = (checkInterval = 15000) => {
  const [movementDetected, setMovementDetected] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const distanceRef = ref(database, 'sensorData/distance');
    
    const checkMovement = () => {
      onValue(distanceRef, (snapshot) => {
        const currentDistance = snapshot.val();
        setMovementDetected(currentDistance > 0);
        setDistance(currentDistance);
      });
    };

    // Initial check
    checkMovement();
    
    // Periodic check
    const interval = setInterval(checkMovement, checkInterval);
    
    return () => {
      clearInterval(interval);
    };
  }, [checkInterval]);

 
  return { movementDetected, distance };
};