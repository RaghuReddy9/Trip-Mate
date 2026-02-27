from sqlmodel import SQLModel, create_engine, Session

import os
from dotenv import load_dotenv

load_dotenv()

# Get the database URL from environment variables, fallback to SQLite for local tests
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///database.db"
)

# Connect args are different for Postgres vs SQLite
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
