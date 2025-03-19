# SonarGuard Home Security System 🚀  

## Overview  
**SonarGuard** is a **web + IoT** security system that provides real-time motion detection and alerts for home security.  
It integrates **Next.js**, **AWS Cognito**, **MongoDB**, and **Firebase** to offer a secure and scalable solution.  

## 🔥 Features  
- **Motion Detection**: Uses **Radar Sensor (Arduino UNO + NodeMCU)** for detecting movement.  
- **Authentication**: **AWS Cognito** for user sign-up & OTP verification.  
- **Secure Access**: **JWT Token Authentication** restricts unauthorized access.  
- **Real-time Alerts**: Sends **SNS Email Alerts** on motion detection using **EmailJS**.  
- **Data Storage**: Stores registered users in **MongoDB**, sensor data in **Firebase Realtime Database**.  

## 🛠 Tech Stack  
- **Frontend**: Next.js (App Router), Tailwind CSS, TypeScript  
- **Backend**: Firebase Realtime Database, MongoDB  
- **Auth & Security**: AWS Cognito, JWT Authentication  
- **IoT Integration**: Radar Sensor, Arduino UNO, NodeMCU  
- **Cloud Services**: AWS Lambda, SNS Email Alerts, EmailJS  
_  

