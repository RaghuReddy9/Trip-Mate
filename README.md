# Real-Time AI Travel Planner

Welcome to the AI Travel Planner! This application uses a React frontend and a Python/FastAPI backend to generate personalized travel itineraries using Google Gemini.

## Prerequisites

- Node.js (for the frontend)
- Python 3.8+ (for the backend)
- A Google Gemini API Key

## How to Run the Application

You will need to run two separate servers: one for the backend API and one for the frontend UI.

### 1. Start the Backend (FastAPI + Python)

1. Open a terminal and navigate to the project root directory (`/Users/raghavendra/Desktop/iomp/`).
2. Make sure your `.env` file is properly configured with your Google Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
3. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   ```
4. Install the Python requirements (FastAPI, Uvicorn, SQLModel, Google Generative AI, etc.). If you don't have a `requirements.txt`, you can install them manually:
   ```bash
   pip install fastapi uvicorn sqlmodel google-generativeai pydantic python-dotenv
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn server.main:app --reload
   ```
   The backend will start running on `http://127.0.0.1:8000`.

### 2. Start the Frontend (React + Vite)

1. Open a **new** terminal window and navigate to the `client` directory:
   ```bash
   cd /Users/raghavendra/Desktop/iomp/client
   ```
2. Install the necessary Node modules (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The terminal will display a local URL (usually `http://localhost:5173/`). Click it or open it in your browser to view the application!

*Note: The frontend expects the backend to be running on port 8000 by default. Make sure both servers are running simultaneously for the app to work correctly.*
