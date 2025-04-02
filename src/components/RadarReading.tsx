"use client";  

import { useState, useEffect } from "react";
import { useMembers } from "@/contexts/MemberContext";
import { stringify } from "querystring";
import MovementAlert from "./DetectMovement";

const RadarReading = () => {
    const [checkMovement, setCheckMovement] = useState(false);

    const {members} =useMembers();
    useEffect(() => {
        if (checkMovement) {
        //post request to internal api
       triggerEmailAlert();
    }}, [checkMovement]);  // Runs when checkMovement changes

    const triggerEmailAlert = async () => {
        const response = await fetch("/api/triggerEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({members: Array.from(members) }), 
        });
    
        const data = await response.json(); 
        console.log(data);

    };
    

    return (
        <div className="flex flex-col justify-center items-center shadow-2xl rounded-3xl p-4 border-2 border-orange-200">
            <label className="block text-black font-light text-3xl">Radar Reading</label>
            <p className="text-blue-600 text-3xl">{checkMovement ? "1" : "0"}</p>
            <p className="text-2xl p-2 rounded-lg" >
            <MovementAlert/> 
            </p>
         
        </div>
    );
};

export default RadarReading;
