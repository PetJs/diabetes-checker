from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
import logging

app = FastAPI()

# Allow all origins for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define PredictRequest model
class PredictRequest(BaseModel):
    gender: str
    age: int
    hypertension: str
    heart_disease: str
    smoking_history: str
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.post("/predict")
async def predict(data: PredictRequest):
    try:
        # External API endpoint
        external_api_url = 'https://diabetes-fastapi.onrender.com/predict'
        
        # Log the incoming request data
        logging.info(f"Request Data: {data.dict()}")

        # Make a request to the external API
        async with httpx.AsyncClient() as client:
            response = await client.post(external_api_url, json=data.dict())
            response.raise_for_status()  # Raise an exception for HTTP errors

            # Log and return the external API response
            external_result = response.json()
            logging.info(f"External API Response: {external_result}")

            return external_result

    except httpx.HTTPStatusError as http_err:
        logging.error(f"HTTPStatusError: {http_err.response.text}")
        raise HTTPException(
            status_code=http_err.response.status_code,
            detail=f"External API error: {http_err.response.text}"
        )
    except httpx.RequestError as req_err:
        logging.error(f"RequestError: {req_err}")
        raise HTTPException(
            status_code=500,
            detail=f"Request error: {req_err}"
        )
    except Exception as err:
        logging.error(f"Unexpected error: {err}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {err}"
        )
