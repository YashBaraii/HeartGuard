import numpy as np
import pandas as pd
import pickle
import streamlit as st
import os

# Get current script directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Build relative path to model files
model_path = os.path.join(BASE_DIR, "models", "model.pkl")
scaler_path = os.path.join(BASE_DIR, "models", "scaler.pkl")
columns_path = os.path.join(BASE_DIR, "models", "columns.pkl")

# Load models
model = pickle.load(open(model_path, "rb"))
scaler = pickle.load(open(scaler_path, "rb"))
expected_cols = pickle.load(open(columns_path, "rb"))

st.title("💗 HeartGuard - Heart Failure Prediction System")

# Input
age = st.number_input("Age", 1, 100)
sex = st.selectbox("Sex", ["M", "F"])
cp = st.selectbox("Chest Pain Type", ["TA", "ATA", "NAP", "ASY"])
resting_bp = st.number_input("RestingBP")
cholesterol = st.number_input("Cholesterol")
fasting_bs = st.selectbox("FastingBS", [0, 1])
rest_ecg = st.selectbox("RestingECG", ["Normal", "ST", "LVH"])
max_hr = st.number_input("MaxHR")
ex_angina = st.selectbox("ExerciseAngina", ["N", "Y"])
oldpeak = st.number_input("Oldpeak")
st_slope = st.selectbox("ST_Slope", ["Up", "Flat", "Down"])

# Manual one-hot encoding matching training (drop_first=True used)
data = {
    "Age": age,
    "RestingBP": resting_bp,
    "Cholesterol": cholesterol,
    "FastingBS": fasting_bs,
    "MaxHR": max_hr,
    "Oldpeak": oldpeak,
    "Sex_M": 1 if sex == "M" else 0,
    "ChestPainType_ASY": 1 if cp == "ASY" else 0,
    "ChestPainType_ATA": 1 if cp == "ATA" else 0,
    "ChestPainType_NAP": 1 if cp == "NAP" else 0,
    # DO NOT include ChestPainType_TA (reference category)
    "RestingECG_Normal": 1 if rest_ecg == "Normal" else 0,
    "RestingECG_ST": 1 if rest_ecg == "ST" else 0,
    # DO NOT include RestingECG_LVH (reference)
    "ExerciseAngina_Y": 1 if ex_angina == "Y" else 0,
    "ST_Slope_Flat": 1 if st_slope == "Flat" else 0,
    "ST_Slope_Up": 1 if st_slope == "Up" else 0,
    # DO NOT include ST_Slope_Down (reference)
}

input_df = pd.DataFrame([data])

# --- FIX: Add missing columns with 0 ---
for col in expected_cols:
    if col not in input_df.columns:
        input_df[col] = 0

# --- FIX: Reorder columns to match training ---
input_df = input_df[expected_cols]

# Now scale input
input_scaled = scaler.transform(input_df)

# Predict button
if st.button("Predict"):
    result = model.predict(input_scaled)[0]
    st.success("Heart Disease Detected" if result == 1 else "No Heart Disease")
