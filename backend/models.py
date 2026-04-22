from pydantic import BaseModel
from typing import List, Optional, Dict

class HealthData(BaseModel):
    Age: int
    BMI: float
    Glucose: float
    BloodPressure: float
    Insulin: float
    PhysicalActivity: int # 0-10
    DietType: int # 0: Low Carb, 1: Balanced, 2: High Carb
    Smoking: int # 0 or 1
    FamilyHistory: int # 0 or 1

class NutritionData(BaseModel):
    name: str
    sugar: float
    carbohydrates: float
    calories: float
    glycemic_index: float

class FoodScanResult(BaseModel):
    labels: List[Dict[str, float]]
    nutrition: Optional[NutritionData]
    risk_score: Dict

class RiskPredictionResult(BaseModel):
    risk_percentage: float
    category: str
    shap_values: Dict[str, float]
    text_explanation: List[str]
    recommendations: Dict[str, List[str]]
