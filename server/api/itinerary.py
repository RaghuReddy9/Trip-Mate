import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Depends
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

from sqlmodel import Session, select
from server.database import get_session
from server.models import Itinerary, User
from server.api.auth import get_current_user

class SaveItineraryRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: str
    travel_style: str
    itinerary_json: dict  # Receives nested object, saves as string

@router.post("/save")
def save_itinerary(
    request: SaveItineraryRequest, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        new_itinerary = Itinerary(
            user_id=current_user.id,
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            budget=request.budget,
            travel_style=request.travel_style,
            itinerary_json=json.dumps(request.itinerary_json)
        )
        session.add(new_itinerary)
        session.commit()
        session.refresh(new_itinerary)
        return {"message": "Itinerary saved successfully!", "id": new_itinerary.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/saved")
def get_saved_itineraries(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    itineraries = session.exec(
        select(Itinerary).where(Itinerary.user_id == current_user.id)
    ).all()
    
    # Needs to parse JSON string back into dict for the client
    results = []
    for it in itineraries:
        results.append({
            "id": it.id,
            "destination": it.destination,
            "start_date": it.start_date,
            "end_date": it.end_date,
            "budget": it.budget,
            "travel_style": it.travel_style,
            "itinerary_json": json.loads(it.itinerary_json),
            "created_at": it.created_at
        })
    return results
