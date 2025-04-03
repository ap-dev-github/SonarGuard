"use client";  

import { useState, useEffect } from "react";
import { useMembers } from "@/contexts/MemberContext";
import { stringify } from "querystring";
import MovementAlert from "./DetectMovement";
import { useMovementDetection } from "@/hooks/useMovementDetection";



const RadarReading = () => {
    const [checkMovement, setCheckMovement] = useState(false);
    const {distance} = useMovementDetection(15000);
    const {members} =useMembers();
 
    return (
        <div className="flex flex-col justify-center items-center shadow-2xl rounded-3xl p-4 border-2 border-orange-200">
            <label className="block text-black font-light text-3xl">Radar Reading</label>
            <p className="text-blue-600 text-3xl">{distance}</p>
            <p className="text-2xl p-2 rounded-lg" >
            <MovementAlert/> 
            </p>
         
        </div>
    );
};

export default RadarReading;
