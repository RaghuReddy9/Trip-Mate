# Deployment Guide: Trip Mate

To take Trip Mate live on the internet, you will need to deploy the **Frontend** and the **Backend** separately.

We recommend **Netlify** for hosting the React frontend and **Render** for hosting the FastAPI Python backend. Both offer excellent free tiers.

---

## Part 1: Prepare Your Code for Production

Before deploying, you need to ensure your code is hosted on GitHub and configured correctly.

### 1. Update the Frontend API URL
Currently, your `client/src/components/ChatPanel.jsx` (and possibly other API calls) points to `http://localhost:8000`. 
Once your backend is live on Render, you must change this to the new live URL.
*Best Practice:* Use an environment variable in Vite, like `import.meta.env.VITE_API_BASE_URL`.

### 2. Push to GitHub
Both Netlify and Render deploy directly from a GitHub repository.
1. Create a new repository on GitHub.
2. In your local terminal (root folder `/Users/raghavendra/Desktop/iomp`):
```bash
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
*(Ensure you have a `.gitignore` file that ignores `node_modules/`, `venv/`, `__pycache__/`, `.env`, and `database.db`)*

---

## Part 2: Deploy the Backend on Render

Render is perfect for running Python FastAPI apps.

1. **Create an Account:** Go to [Render.com](https://render.com) and sign up using your GitHub account.
2. **New Web Service:** Click "New Web Service" and select "Build and deploy from a Git repository".
3. **Connect Repository:** Connect the GitHub repository you just created.
4. **Configuration Details:**
   * **Name:** `tripmate-api` (or any name you like)
   * **Root Directory:** Leave blank (or `/` depending on how your repo is structured)
   * **Environment:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt` (Make sure you generate a `requirements.txt` file first by running `pip freeze > requirements.txt` locally!)
   * **Start Command:** `uvicorn server.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:** In the Advanced settings, add your Gemini API Key:
   * Key: `GEMINI_API_KEY`
   * Value: `Your_Actual_API_Key`
6. **Deploy:** Click "Create Web Service". Render will start building your API.
7. **Get Your URL:** Once live, copy the URL at the top left (e.g., `https://tripmate-api.onrender.com`). You will need this for the frontend!

---

## Part 3: Deploy the Frontend on Netlify

Netlify is the easiest way to host React/Vite applications.

1. **Update API Endpoint:** Before deploying the frontend, make sure to change all hardcoded `http://localhost:8000` strings in your React code to the new Render URL you just got! Push this change to GitHub.
2. **Create an Account:** Go to [Netlify.com](https://netlify.com) and log in with GitHub.
3. **Add New Site:** Click "Add new site" -> "Import an existing project" -> Choose GitHub.
4. **Select Repository:** Find and click your Trip Mate repository.
5. **Configuration Details:**
   * **Base directory:** `client/` (Since your React code is inside the `client` folder)
   * **Build command:** `npm run build`
   * **Publish directory:** `client/dist` (Vite outputs the built site to the `dist` folder)
6. **Deploy:** Click "Deploy site".
7. **Configure Redirects (Important for React Router):** If you use React Router, you need to create a `_redirects` file in your `client/public` folder with the following content to prevent 404 errors on refresh:
   `/*    /index.html   200`
   *(Push this to github if you haven't)*

Your Trip Mate app is now live! Netlify will provide you with a public URL you can share with the world.
