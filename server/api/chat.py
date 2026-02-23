import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

# Use a model that supports streaming
# Trying to respect "2.5" request by using the capable 1.5 Pro or Flash
MODEL_NAME = "gemini-2.5-flash" 

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@router.post("/stream")
async def stream_chat(request: ChatRequest):
    try:
        system_instruction = """
        You are an expert AI Travel Planner. 
        When asked to plan a trip, generate a detailed day-by-day itinerary.
        
        CRITICAL: When generating an itinerary, you MUST output valid JSON within markdown code blocks (```json ... ```).
        The JSON structure must be:
        {
          "destination": "City, Country",
          "itinerary": {
            "day1": {
              "title": "Theme of the day",
              "morning": { "activity": "...", "description": "...", "cost": "..." },
              "afternoon": { "activity": "...", "description": "...", "cost": "..." },
              "evening": { "activity": "...", "description": "...", "cost": "..." }
            },
            "day2": ...
          }
        }
        
        For general questions, just chat normally.
        """
        
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=system_instruction)
        
        # Convert history format if necessary
        chat_history = []
        for msg in request.history:
            if msg['role'] == 'system': continue
            role = "user" if msg['role'] == 'user' else "model"
            chat_history.append({"role": role, "parts": [msg['content']]})

        chat = model.start_chat(history=chat_history)
        
        # Generate streaming response
        response = chat.send_message(request.message, stream=True)
        
        # Generator for streaming response
        async def response_generator():
            for chunk in response:
                if chunk.text:
                    yield chunk.text

        from fastapi.responses import StreamingResponse
        return StreamingResponse(response_generator(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
