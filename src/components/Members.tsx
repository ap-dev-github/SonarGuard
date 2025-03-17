import { useState } from "react";

const Members = () => {
const getMembers = () => {
    console.log("Call the api route for the get member fetch ")
}
   const addMember = () => {
  console.log("Call the fetch from the api/member.ts")
   };
    return (
<div className="flex  flex-col justify-center items-center shadow-lg rounded w-1/2 padding p-4">
    <label htmlFor="email" className="block text-black font-light text-lg">Add New Member</label>
    <input type="email" className="w-full flex bg-gray-200 px-2 py-2 m-2 rounded-md focus:ring-2 focus:ring-blue-200 outline-none " placeholder="Enter Email..." />
    <button onClick={addMember} className="bg-green-500 px-3 py-2 text-white p-3 shadow-md rounded-lg hover:bg-green-600">Add Member</button>
    <label htmlFor="email" className="block text-black font-light p-4 text-md">Members List</label>
    </div>
    );
}
export default Members;