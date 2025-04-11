# React + TypeScript + Vite
🌟 Mental Health Tracker - Frontend
This is the frontend for the Mental Health Tracker application, built using React.js. It allows users to log their mental health data and visualize trends.

🎯 Features
✅ Google OAuth Login
✅ Submit logs with form validation
✅ Real-time updates using WebSocket
✅ Interactive charts for health trends
✅ Toast notifications for better UX
🚀 Installation & Setup
** Clone the Repository**
git clone https://github.com/your-repo-url.git cd frontend

Install Dependencies
npm install
node version -22

Set Up Environment Variables
Create a .env file in the frontend root directory:

REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id REACT_APP_API_URL=http://localhost:4000

Run the Application
npm start The frontend runs on http://localhost:3000.

📡 API Calls & WebSocket
🔑 Authentication
Users log in via Google OAuth. A JWT token is stored in localStorage for authentication.

📌 Logging
Action Description Submit Log Users can submit logs via a form. Real-Time Updates Logs update automatically via WebSockets.

📈 Charts
Uses Recharts for data visualization. Fetches logs from API and updates in real-time.

🎨 UI Components
Component Description Login.js Handles Google OAuth login. Form.js User form for submitting logs. Chart.js Visualizes logs with line charts.

🔌 WebSocket Integration
The frontend listens for WebSocket events from the backend:

import { socket } from "../utils/api";

socket.on("updateLogs", (newLogs) => { console.log("New logs received:", newLogs); });

🛠 Built With
React.js - Frontend framework Recharts - Data visualization Socket.io-client - WebSocket communication React Toastify - Toast notifications Axios - API calls
