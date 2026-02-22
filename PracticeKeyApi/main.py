from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
from httpx import AsyncClient, ReadTimeout
from typing import Optional
from datetime import date, timedelta

load_dotenv()
NASA_API_KEY = os.getenv("NASA_API_KEY")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # lock this down in production
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def get_root():
    return {"message" : "Hello this is my root"}

@app.get("/v1/apod")
async def get_apod(apod_date: Optional[str] = None):
    NASA_API_URL = "https://api.nasa.gov/planetary/apod"
    
    async with AsyncClient(timeout = 10) as client:
        try:
            response = await client.get(url = NASA_API_URL, params = {"api_key" : NASA_API_KEY, "date" : apod_date})
        except ReadTimeout:
            raise HTTPException(status_code = 504, detail = "NASA TIMEOUT ERROR")
        
    if(response.status_code != 200):
        handle_nasa_errors(response.status_code, response.json()["error_message"])
    return response.json()

@app.get("/v1/hazard")
async def get_hazard(start_date: Optional[str] = None, end_date: Optional[str] = None):
    NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed"
    if not start_date:
        start_date = str(date.today())
    if not end_date:
        end_date = str(date.today()+timedelta(days=1))
        
    async with AsyncClient(timeout = 10) as client:
        try:
            response = await client.get(url = NASA_API_URL, params = {"api_key": NASA_API_KEY, "start_date" : start_date, "end_date":end_date})
        except ReadTimeout:
            raise HTTPException(status_code = 504, detail = "NASA TIMEOUT ERROR")
    if(response.status_code != 200):
        handle_nasa_errors(response.status_code, response.json()["error_message"])
    return response.json()   

def handle_nasa_errors(response_code, error_message = None):
    response_errors = {
        400: f"Bad Request: {error_message}",
        403: f"Invalid API Key: {error_message}",
        429: f"API key rate limit {error_message}",
        404: f"NASA resource not found {error_message}",
        500: f"NASA Internal Server Error {error_message}",
        504: f"NASA TIMEOUT ERROR {error_message}"
    }
    detail = response_errors.get(response_code,"NASA API ERROR")
    raise HTTPException(status_code= response_code, detail = detail)