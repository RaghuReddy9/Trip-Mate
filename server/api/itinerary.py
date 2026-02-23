import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

MODEL_NAME = "gemini-2.5-flash"

class ItineraryRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: str
    travel_style: str

@router.post("/generate")
async def generate_itinerary(request: ItineraryRequest):
    try:
        model = genai.GenerativeModel(MODEL_NAME, generation_config={"response_mime_type": "application/json"})
        
        prompt = f"""
        Generate a detailed day-by-day travel itinerary for a trip to {request.destination}.
        Dates: {request.start_date} to {request.end_date}.
        Budget: {request.budget}.
        Travel Style: {request.travel_style}.
        
        Output strictly in JSON format with the following structure:
        {{
          "destination": "{request.destination}",
          "itinerary": {{
            "day1": {{
              "title": "Day 1 Title",
              "date": "YYYY-MM-DD",
              "morning": {{ "activity": "...", "description": "...", "cost": "...", "type": "food/travel/activity" }},
              "afternoon": {{ "activity": "...", "description": "...", "cost": "...", "type": "food/travel/activity" }},
              "evening": {{ "activity": "...", "description": "...", "cost": "...", "type": "food/travel/activity" }}
            }},
            ...
          }}
        }}
        """
        
        response = model.generate_content(prompt)
        return json.loads(response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
