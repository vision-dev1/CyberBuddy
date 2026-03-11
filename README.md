# CyberBuddy
>YET TO BE RELEASED

CyberBuddy is a professional AI cybersecurity assistant built to explain vulnerabilities, provide code security analysis, and recommend best practices using the Groq AI API (`llama3-70b-8192`). 

The application is structured with a fast Python backend (FastAPI) and a minimal web frontend (HTML/CSS/JS).

## Project Structure
- `/backend`: Contains the FastAPI application and Groq API orchestration.
- `/frontend`: Contains the UI layout, styling, and client-side chat logic.

## Prerequisites
- Python 3.8+
- [Groq API Key](https://console.groq.com/)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend/` directory and add your Groq API Key:
   ```env
   GROQ_API_KEY=your_actual_api_key_here
   ```

## Running the Application

### 1. Start the Backend API
From the `backend/` directory, run the FastAPI server using Uvicorn:
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000/chat`.

### 2. View the Frontend Chat
Open the `frontend/index.html` file in your preferred web browser.

You can now interact with CyberBuddy! All your chats are saved to `localStorage`, and you can seamlessly switch between past conversations using the sidebar.

# Author 
Vision KC<br>
[Github](https://github.com/vision-dev1)
