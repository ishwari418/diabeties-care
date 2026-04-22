import os
import numpy as np
import pandas as pd
import xgboost as xgb
import shap
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

class MLEngine:
    def __init__(self):
        self.food_model = MobileNetV2(weights='imagenet')
        self.risk_model = None
        self.explainer = None
        self.model_path = os.path.join('backend', 'models', 'diabetes_model.json')
        
        if os.path.exists(self.model_path):
            self.load_risk_model()

    def load_risk_model(self):
        self.risk_model = xgb.XGBClassifier()
        self.risk_model.load_model(self.model_path)
        # Initialize SHAP explainer
        # We need some background data for SHAP, but for TreeExplainer it might not be strictly necessary
        self.explainer = shap.TreeExplainer(self.risk_model)

    def classify_food(self, image_path):
        img = Image.open(image_path).resize((224, 224))
        x = np.expand_dims(np.array(img), axis=0)
        x = preprocess_input(x)
        
        preds = self.food_model.predict(x)
        decoded = decode_predictions(preds, top=3)[0]
        
        # Result format: (id, label, probability)
        return [{"label": label.replace('_', ' '), "probability": float(prob)} for _, label, prob in decoded]

    def predict_diabetes_risk(self, user_data):
        """
        user_data: dict with Age, BMI, Glucose, etc.
        """
        if self.risk_model is None:
            return {"error": "Model not loaded"}
            
        features = ['Age', 'BMI', 'Glucose', 'BloodPressure', 'Insulin', 
                    'PhysicalActivity', 'DietType', 'Smoking', 'FamilyHistory']
        
        input_df = pd.DataFrame([user_data], columns=features)
        
        prob = self.risk_model.predict_proba(input_df)[0][1]
        risk_percentage = float(prob * 100)
        
        category = "Low"
        if risk_percentage > 70:
            category = "High"
        elif risk_percentage > 30:
            category = "Medium"
            
        # SHAP Explanation
        shap_values = self.explainer.shap_values(input_df)
        
        # For XGBoost binary classification, shap_values is a 2D array (n_samples, n_features)
        # or list of arrays. In newer versions it might be different.
        if isinstance(shap_values, list):
            shap_val = shap_values[1][0] # Positive class
        else:
            shap_val = shap_values[0]
            
        explanations = []
        for i, feat in enumerate(features):
            val = shap_val[i]
            if val > 0.1:
                explanations.append(f"High {feat} increases your risk.")
            elif val < -0.1:
                explanations.append(f"Lower {feat} reduces your risk.")

        return {
            "risk_percentage": round(risk_percentage, 1),
            "category": category,
            "shap_values": {feat: float(val) for feat, val in zip(features, shap_val)},
            "text_explanation": explanations
        }

# Global instance
engine = MLEngine()
