from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api import chat, itinerary, auth
from server.database import create_db_and_tables

app = FastAPI(title="AI Travel Planner")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=False, # Must be False when origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(itinerary.router, prefix="/api/itinerary", tags=["itinerary"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Travel Planner API"}
