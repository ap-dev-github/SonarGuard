import { useState, useEffect } from "react";

const RadarReading = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token") || "");
    }, []); 

    const getMembers = async () => {
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        try {
            const response = await fetch("/api/triggerEmail", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log("Response from the server:", data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center shadow-2xl rounded-3xl w-1/2 p-4 border-2 border-blue-200">
            <label className="block text-black font-light text-2xl">Radar Reading</label>
            <p className="text-blue-600 text-xl">#</p>
            <button
                className="bg-blue-300 text-black rounded shadow-lg hover:bg-blue-500 p-2"
                onClick={getMembers}
            >
                Click Me
            </button>
        </div>
    );
};

export default RadarReading;
