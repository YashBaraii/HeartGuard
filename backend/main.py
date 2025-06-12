from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pickle
import pandas as pd
import numpy as np
import os
from typing import Optional
from datetime import datetime


class Input_Fields(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years")
    sex: str = Field(..., pattern="^(M|F)$", description="Sex (M or F)")
    chestPainType: str = Field(
        ..., pattern="^(TA|ATA|NAP|ASY)$", description="Chest pain type"
    )
    restingBP: float = Field(
        ..., ge=80, le=200, description="Resting blood pressure in mmHg"
    )
    cholesterol: float = Field(
        ..., ge=0, le=1000, description="Cholesterol level in mg/dl"
    )
    fastingBS: int = Field(
        ..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1) or not (0)"
    )
    restECG: str = Field(
        ..., pattern="^(Normal|ST|LVH)$", description="Resting ECG results"
    )
    maxHR: float = Field(..., ge=60, le=220, description="Maximum heart rate achieved")
    exerciseAngina: str = Field(
        ..., pattern="^(Y|N)$", description="Exercise induced angina (Y or N)"
    )
    oldpeak: float = Field(
        ..., ge=0, le=10, description="ST depression induced by exercise"
    )
    stSlope: str = Field(
        ..., pattern="^(Up|Flat|Down)$", description="Slope of peak exercise ST segment"
    )

    @field_validator("age")
    @classmethod
    def validate_age(cls, v):
        if v < 1 or v > 120:
            raise ValueError("Age must be between 1 and 120 years")
        return v

    @field_validator("restingBP")
    @classmethod
    def validate_bp(cls, v):
        if v < 80 or v > 200:
            raise ValueError("Resting blood pressure must be between 80 and 200 mmHg")
        return v

    @field_validator("cholesterol")
    @classmethod
    def validate_cholesterol(cls, v):
        if v < 0 or v > 1000:
            raise ValueError("Cholesterol must be between 0 and 1000 mg/dl")
        return v

    @field_validator("maxHR")
    @classmethod
    def validate_maxhr(cls, v):
        if v < 60 or v > 220:
            raise ValueError("Maximum heart rate must be between 60 and 220 bpm")
        return v

    @field_validator("oldpeak")
    @classmethod
    def validate_oldpeak(cls, v):
        if v < 0 or v > 10:
            raise ValueError("Oldpeak must be between 0 and 10")
        return v


class PredictionResponse(BaseModel):
    risk: str
    probability: float
    message: str
    timestamp: str
    input_data: dict


app = FastAPI(
    title="Heart Disease Prediction API",
    description="API for predicting heart disease risk based on patient data",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://heartdiseasepredictionyb.netlify.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model, scaler, columns
try:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model = pickle.load(open(os.path.join(BASE_DIR, "models", "model.pkl"), "rb"))
    scaler = pickle.load(open(os.path.join(BASE_DIR, "models", "scaler.pkl"), "rb"))
    expected_cols = pickle.load(
        open(os.path.join(BASE_DIR, "models", "columns.pkl"), "rb")
    )
except Exception as e:
    print(f"Error loading model files: {str(e)}")
    raise


@app.get("/")
async def root():
    return {
        "message": "Heart Disease Prediction API",
        "status": "active",
        "version": "1.0.0",
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(input: Input_Fields):
    try:
        # Manual one-hot encoding
        data = {
            "Age": input.age,
            "RestingBP": input.restingBP,
            "Cholesterol": input.cholesterol,
            "FastingBS": input.fastingBS,
            "MaxHR": input.maxHR,
            "Oldpeak": input.oldpeak,
            "Sex_M": 1 if input.sex == "M" else 0,
            "ChestPainType_ASY": 1 if input.chestPainType == "ASY" else 0,
            "ChestPainType_ATA": 1 if input.chestPainType == "ATA" else 0,
            "ChestPainType_NAP": 1 if input.chestPainType == "NAP" else 0,
            "RestingECG_Normal": 1 if input.restECG == "Normal" else 0,
            "RestingECG_ST": 1 if input.restECG == "ST" else 0,
            "ExerciseAngina_Y": 1 if input.exerciseAngina == "Y" else 0,
            "ST_Slope_Flat": 1 if input.stSlope == "Flat" else 0,
            "ST_Slope_Up": 1 if input.stSlope == "Up" else 0,
        }

        input_df = pd.DataFrame([data])

        # Add missing columns
        for col in expected_cols:
            if col not in input_df.columns:
                input_df[col] = 0

        # Ensure columns are in the same order as expected
        input_df = input_df[expected_cols]

        # Scale the input
        input_scaled = scaler.transform(input_df)

        # Make prediction
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1]

        risk = "high" if prediction == 1 else "low"
        message = (
            "High risk of heart disease"
            if prediction == 1
            else "Low risk of heart disease"
        )

        return {
            "risk": risk,
            "probability": float(probability * 100),  # Convert to percentage
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "input_data": input.dict(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error making prediction: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
