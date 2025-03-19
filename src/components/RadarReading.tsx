"use client";  

import { useState, useEffect } from "react";

const RadarReading = () => {
    const [checkMovement, setCheckMovement] = useState(false);

    useEffect(() => {
        if (checkMovement) {
         //   triggerEmailAlert();
        }
    }, [checkMovement]);  // Runs when checkMovement changes

    const triggerEmailAlert = async () => {
    

    };

    return (
        <div className="flex flex-col justify-center items-center shadow-2xl rounded-3xl w-1/2 p-4 border-2 border-blue-200">
            <label className="block text-black font-light text-3xl">Radar Reading</label>
            <p className="text-blue-600 text-3xl">{checkMovement ? "1" : "0"}</p>
            <p className={`text-2xl p-2 rounded-lg ${checkMovement ? "bg-red-200 text-red-600" : "bg-green-100 text-green-400"}`}>
                {checkMovement ? "Movement Detected!" : "No Movement Detected!"}
            </p>
        </div>
    );
};

export default RadarReading;
