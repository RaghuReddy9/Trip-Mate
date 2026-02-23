Step 1: Clone your repo

On the new laptop, open a terminal and run:

git clone https://github.com/RaghuReddy9/Trip-Mate.git
cd Trip-Mate
Step 2: Set up the backend (Python/FastAPI)

Make sure Python 3.10+ is installed.

Create a virtual environment:

python3 -m venv venv

Activate it:

macOS/Linux:

source venv/bin/activate

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Make sure .env file exists with your API keys (or any secrets).

Run the backend:

uvicorn server.main:app --host 0.0.0.0 --port 8000

Your backend should now be running at:
http://localhost:8000

Step 3: Set up the frontend (React)

Go to your frontend folder:

cd client

Install npm packages:

npm install

Make sure .env file exists in client with:

VITE_API_BASE_URL=http://localhost:8000

Start the frontend dev server:

npm run dev
