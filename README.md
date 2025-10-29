# SleepMetrics: Sleep Quality Predictor (React, Node.js, Python ML)

## Project Description
SleepMetrics is a three-tier, full-stack application designed to analyze user-provided health data (age, sleep duration, heart rate, stress level, etc.) and generate a personalized **Sleep Quality Score** (1-10) using a trained Machine Learning model.

This project demonstrates proficiency in integrated microservices architecture, modern web development (React/Tailwind), and backend API design (Node.js/Express), all powered by a dedicated Python ML service (Flask).

## Architecture
The application is structured into three main independent services:

1.  **Frontend (Vercel):** Single Page Application (SPA) built with **React** and styled using **Tailwind CSS**. Handles user interface, state management, and routing.
2.  **Backend API (Node.js/Express):** Handles user authentication (JWT), user profile management, fetching/saving prediction history to **MongoDB Atlas**, and processing user feedback.
3.  **ML API (Python/Flask):** A lightweight server that hosts the trained **Random Forest Regressor** model pipeline (saved as `sleep_model.pkl`). It takes raw data inputs from the Node.js API, preprocesses them, and returns the numerical sleep prediction score.

## 🚀 Live Demo & Deployment
- **Live Frontend URL:** [Link to your Vercel deployment URL here]
- **Deployment Platform:** Frontend (Vercel), Backend/ML (Render/Other PaaS)

## 🛠️ Local Installation & Setup

### Prerequisites
* Node.js (LTS recommended)
* Python 3.8+ with `venv` or `conda`
* MongoDB Atlas Account (for cloud database)

### 1. Backend Setup (`backend/`)

1.  Install dependencies:
    ```bash
    cd backend
    npm install
    ```
2.  Configure your environment variables in a **`.env`** file. **CRITICAL:** Use your live Atlas connection string and secrets.

    ```
    MONGO_URI=mongodb+srv://sharma:root@cluster0.zdkdwnz.mongodb.net/sleepmetrics?retryWrites=true&w=majority
    JWT_SECRET=your_secret_key_for_jwt
    ADMIN_KEY=your_admin_signup_key
    PORT=5000
    ```

3.  Start the server:
    ```bash
    npm run dev
    ```

### 2. ML API Setup (`ml-api/`)

1.  Set up the virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Ensure the trained model file (`sleep_model.pkl`) and the Flask application file (`app.py`) are present.
4.  Start the Flask server:
    ```bash
    python app.py  # Runs on port 5001
    ```

### 3. Frontend Setup (`frontend/`)

1.  Install dependencies:
    ```bash
    cd frontend
    npm install
    ```
2.  Ensure API base URLs are set to your local host for testing (or update to your live deployed URLs for deployment):
    * Check `frontend/src/api/api.js`.
3.  Start the React application:
    ```bash
    npm run dev  # Runs on port 5173 (Vite default)
    ```

---

## Step 3: Deployment Preparation Files

These files tell your hosting service (like **Render**) how to start your servers.

### File 1: `backend/Procfile`

Create a file named `Procfile` (no extension) inside your **`backend`** directory.
