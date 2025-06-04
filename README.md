# 💗 HeartGuard - Heart Failure Prediction System

Predicting the presence of heart disease using clinical data with a machine learning model.

---

## Table of Contents

- [Overview](#overview)
- [Dataset](#dataset)
- [Features](#features)
- [Model](#model)
- [Installation](#installation)
- [Usage](#usage)
- [Results](#results)
- [Future Work](#future-work)
- [References](#references)
- [License](#license)

---

## Overview

This project aims to predict whether a patient has heart disease based on various clinical features such as age, chest pain type, cholesterol levels, and more.  
The prediction model uses supervised machine learning techniques to classify the presence or absence of heart disease.

---

## Dataset

- Dataset Source: [Heart Failure Prediction Dataset](https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction?resource=download)

- Size: Approximately 918 records with 12 attributes

- Target Variable: `HeartDisease` (0 = no disease, 1 = disease)

- Data preprocessing includes handling categorical variables via one-hot encoding and scaling numerical features.

---

## Features

Key input features used for prediction:

- Age
- Sex
- Chest Pain Type (ASY, ATA, NAP, TA)
- Resting Blood Pressure
- Cholesterol
- Fasting Blood Sugar
- Resting ECG results
- Maximum Heart Rate achieved
- Exercise Induced Angina
- Oldpeak (ST depression induced by exercise)
- ST Slope

---

## Model

- Algorithm: Random Forest Classifier (or specify your actual model)
- Training: 70% training data, 30% testing data
- Performance Metrics: Accuracy, Precision, Recall, F1-Score (86%)
- Feature scaling using StandardScaler to normalize numeric data.

---

## Installation

### Prerequisites

- Python 3.10 or 3.11
- pip package manager

1. Clone the repository:

```bash
git clone https://github.com/YashBaraii/HeartGuard.git
cd HeartGuard
```

2. (Optional) Create and activate a virtual environment:

```bash
# Linux/macOS
python3.10 -m venv venv
source venv/bin/activate

# Windows
py -3.10 -m venv venv
venv\Scripts\activate
```

3. Install required packages:

```bash
pip install -r requirements.txt
```

## Usage

Run the Streamlit app:

```bash
streamlit run app/streamlit_app.py
```

Use the web interface to input patient data and get instant heart disease prediction results.

## Results

- The model achieved an accuracy of 86% on the test set.

- The model effectively distinguishes between patients with and without heart disease based on clinical features.

## References

Heart Failure Prediction Dataset: https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction/data

Scikit-learn documentation: https://scikit-learn.org/stable/

Streamlit documentation: https://docs.streamlit.io/

## License

This project is licensed under the [MIT License](https://github.com/YashBaraii/HeartGuard/blob/main/LICENSE) - see the LICENSE file for details.
