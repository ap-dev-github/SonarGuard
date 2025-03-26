import { useEffect, useState } from "react";
import AlertMessage from "./AlertMessage";
import { useMembers } from "@/contexts/MemberContext";

const Members = () => {
    const [email, setEmail] = useState(""); 
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error"}|null>(null); 
    const { members, setMembers } = useMembers();
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
        await getMembers(); //fetch Updated List
        showAlert("Member added successfully!","success")
      } else {
        showAlert("Error adding member!","error");
      } 
    };

const getMembers = async() => {
    const response = await fetch("/api/getMembers", {
        method: "GET",
            headers: {
             "Content-Type": "application/json",
             "Authorization":`Bearer ${token}`,
            },    
    });
    const emailSet = await response.json();
    console.log("Response From Server:",emailSet);
    if (response.ok) {
        setMembers(emailSet.members || []);
        showAlert("Members fetched successfully!","success")
    } else {
        showAlert("Error Fetching the members!","error");
    }
}

//Function to delete a member from the list 
const deleteMember = async(email:string) => {
  try {
    const res = await fetch('/api/deleteMember', {
      method: "DELETE", 
      headers : 
       { "Content-Type": "application/json",},
       body: JSON.stringify({email})
    });
    if (res.ok) {
      await getMembers();
      console.log("Member deletion successfuly!")
      showAlert("Member deleted successfully!", "success");
    }
  } catch {
      console.log("Error deleting the member");
      showAlert("Error deleting member","error");
  }
}
//Refreshes at page refresh and mount 
useEffect(() => {
    if(token)
 getMembers();
},[token]);
   
    return (
<div className="flex flex-col justify-center items-center shadow-2xl rounded-3xl w-1/2 padding p-4 border-2 border-blue-200">
    {/*Alert Message*/}
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-3 rounded-lg ">
    {alert && <AlertMessage message={alert.message} type={alert.type}/>} 
    </div>
     {/*Email Label-Input Section*/}
    <label htmlFor="email" className="block text-black font-sans text-lg">Add New Member</label>
    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full flex bg-gray-200 px-2 py-2 mx-2 my-4 rounded-md focus:ring-2 focus:ring-blue-100 outline-none " placeholder="Enter Email..." />
    <button onClick={addMember} className="bg-green-500 px-3 py-2 text-white p-3 drop-shadow-lg rounded-lg hover:bg-green-600">Add Member</button>
     {/*Display Members*/}
    <label htmlFor="email" className="block text-black font-bold p-4 text-md">Members List</label>
    <div className="flex-col items-center font-serif justify-center ">
     <ul>
       {members.length > 0 ? (
        members.map((member, index) => (
      <li className="flex w-full justify-between items-center break-all px-4 py-2 border-2 bg-blue-100  drop-shadow-lg rounded-lg m-2" key={index}><span>{member}</span><button className="text-white bg-red-100 shadow-lg round-xl hover:bg-red-200">❌</button></li>
        ))
       ):(
          <p className="">No members added yet.</p>
       )}
     </ul>
     </div>
    </div>
    );
};
export default Members;