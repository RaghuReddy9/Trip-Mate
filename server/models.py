from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class Itinerary(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    destination: str
    start_date: str
    end_date: str
    budget: str
    travel_style: str
    itinerary_json: str  # Storing as JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str # user or model
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
