# Mental Health Progress Tracker Application

This is a full-stack monorepo application that allows users to track logs such as sleep and activity. It includes real-time updates using Google authentication, chart visualizations, and form validation.

## Tech Stack

- Node.js (v22)
- TypeScript
- React.js
- Tailwind CSS
- Recharts
- Axios
- SQLite (as the database)

## Project Structure

```
.
├── client   # Frontend - Vite + React.js
└── server   # Backend - Node.js + TypeScript + SQLite
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Install dependencies for both Server & Client

```bash
npm install
```

### 3. Set up environment variables for both Server & Client

Copy `.env.sample` to `.env` in both `client/` and `server/` folders. Add required Variables mentioned in `.env.sample` and update the values:

#### `client/.env`

```
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_API_URL=http://localhost:4000
```

#### `server/.env`
```
PORT=4000
JWT_SECRET=your-jwt-secret
```

### 4. Run the application

Open two terminals:

**Terminal 1** - Start the frontend

```bash
cd client
npm run dev
```

**Terminal 2** - Start the backend

```bash
cd server
npm run dev
```

- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:4000`

## Features

### Authentication

- Google OAuth login.

### Logging

- Users can submit logs via a form.
- Users can view and manage logs (including backdated entries).

### Charts & Visualization

- Logs are visualized using line charts via Recharts.
- Users can toggle between weekly and monthly views.

### Models

- `User` has many `Logs`
- `Log` may have many `Activities`

## Validation

- All form fields are validated before submission to ensure data integrity.

## Future Improvements

- Dockerize the application.
- Add search functionality to filter logs.
- Add ability to update existing logs.