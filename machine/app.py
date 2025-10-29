from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

# Load the single, integrated pipeline model
try:
    # Loads the sleep_model.pkl file containing the scaler, encoder, and Random Forest Regressor
    model_pipeline = joblib.load("sleep_model.pkl")
    print("Model pipeline loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model_pipeline = None

app = Flask(__name__)
# Allow requests from the frontend (e.g., http://localhost:5173)
CORS(app)

# VVVV ADD MAPPING DICTIONARIES VVVV
# These MUST match the mappings used in train_model.py
BMI_MAPPING = {'Normal': 1, 'Overweight': 2, 'Obese': 3, 'Normal Weight': 1}
DISORDER_MAPPING = {'None': 0, 'Sleep Apnea': 1, 'Insomnia': 2}
# ^^^^ ADD MAPPING DICTIONARIES ^^^^


@app.route('/')
def home():
    return 'Sleep Quality Prediction API is running!'


@app.route('/predict', methods=['POST'])
def predict():
    if model_pipeline is None:
        return jsonify({'error': 'ML model not loaded on server.'}), 500

    try:
        data = request.json
        print(f"Received data for prediction: {data}")  # DEBUG LOG

        # 1. Extract Systolic and Diastolic BP from the combined string '120/80'
        bp_parts = data['Blood Pressure'].split('/')
        systolic = int(bp_parts[0])
        diastolic = int(bp_parts[1])

        # VVVV CRITICAL FIX: MAP CATEGORIES TO NUMBERS VVVV
        data['BMI Category'] = BMI_MAPPING.get(data['BMI Category'])
        data['Sleep Disorder'] = DISORDER_MAPPING.get(data['Sleep Disorder'])

        # Check if mapping failed (e.g., if the category wasn't found)
        if data['BMI Category'] is None or data['Sleep Disorder'] is None:
            return jsonify({'error': 'Invalid category provided for BMI Category or Sleep Disorder.'}), 400
        # ^^^^ CRITICAL FIX: MAP CATEGORIES TO NUMBERS ^^^^

        # 2. Reconstruct the input data with ALL 14 columns the model expects.
        input_data = {
            'Age': [data['Age']],
            'Gender': [data['Gender']],
            'Sleep Duration': [data['Sleep Duration']],
            'Occupation': [data['Occupation']],

            # These are now NUMERICAL after mapping
            'BMI Category': [data['BMI Category']],
            'Sleep Disorder': [data['Sleep Disorder']],

            'Heart Rate': [data['Heart Rate']],
            'Stress Level': [data['Stress Level']],
            'Daily Steps': [data['Daily Steps']],
            'Physical Activity Level': [data['Physical Activity Level']],
            'Body Temperature': [data['Body Temperature']],
            'Systolic_BP': [systolic],
            'Diastolic_BP': [diastolic],
        }

        # 3. Define the precise column order the model was trained with
        column_order = [
            'Age', 'Gender', 'Sleep Duration', 'Occupation', 'BMI Category',
            'Sleep Disorder', 'Heart Rate', 'Stress Level', 'Daily Steps',
            'Physical Activity Level', 'Body Temperature', 'Systolic_BP',
            'Diastolic_BP'
        ]

        # 4. Create DataFrame and ensure column order is respected
        df = pd.DataFrame(input_data, columns=column_order)

        # 5. Predict using the pipeline
        prediction_result = model_pipeline.predict(df)
        score = float(prediction_result[0])
        print(f"Prediction successful. Score: {score:.2f}")
        return jsonify({'prediction': score}), 200

    except KeyError as e:
        print(f"Error during prediction: Missing expected data key {e}")
        return jsonify({'error': f"Missing data field from frontend: {e}. Please ensure all fields are filled."}), 400
    except Exception as e:
        print(f"Fatal Error during ML processing: {e}")
        return jsonify({'error': f"ML Processing Failed: {str(e)}"}), 400


if __name__ == '__main__':
    # Running on port 5001 to avoid conflict with Node.js backend (port 5000)
    app.run(port=5001, debug=True)
