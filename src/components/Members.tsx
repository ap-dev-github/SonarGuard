import { useState } from "react";
import AlertMessage from "./AlertMessage";

const Members = () => {
    const [email, setEmail] = useState(""); 
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error"}|null>(null); 
    const token = localStorage.getItem("token");

    
    const showAlert = (message:string,type:"success"|"error") => {
      setAlert({message,type});
      if(type === "success"){
        setTimeout(() => {
            setAlert(null);
      },3000);}
    };

    const addMember = async() => {
    if(!email) return;
    const response = await fetch("/api/addMember",
      {
        method: "POST",
        headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({email}),
      });
      const data = await response.json();
      console.log("Response from server:", data);
      if(response.ok){
        setEmail("");
        showAlert("Member added successfully!","success")
      } else {
        showAlert("Error adding member!","error");
      } 
    };

const getMembers = () => {
    console.log("Call the api route for the get member fetch ")
}
   
    return (
<div className="flex  flex-col justify-center items-center shadow-lg rounded w-1/2 padding p-4">
      {alert && <AlertMessage message={alert.message} type={alert.type}/>}
    <label htmlFor="email" className="block text-black font-light text-lg">Add New Member</label>
    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full flex bg-gray-200 px-2 py-2 m-2 rounded-md focus:ring-2 focus:ring-blue-200 outline-none " placeholder="Enter Email..." />
    <button onClick={addMember} className="bg-green-500 px-3 py-2 text-white p-3 shadow-md rounded-lg hover:bg-green-600">Add Member</button>
    <label htmlFor="email" className="block text-black font-light p-4 text-md">Members List</label>
    </div>
    );
}
export default Members;