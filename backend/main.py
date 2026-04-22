from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from .models import HealthData, RiskPredictionResult, FoodScanResult
from .ml_engine import engine
from .logic_engine import calculate_food_risk_score, get_recommendations
from .nutrition_api import get_food_nutrition_by_name, get_food_nutrition_by_barcode

app = FastAPI(title="AI Diabetic Companion API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Diabetic Companion API"}

@app.post("/scan-food", response_model=FoodScanResult)
async def scan_food(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 1. Classify food
    labels = engine.classify_food(file_path)
    top_label = labels[0]['label']
    
    # 2. Fetch nutrition
    nutrition = get_food_nutrition_by_name(top_label)
    
    # 3. Calculate risk
    risk = calculate_food_risk_score(nutrition if nutrition else {"sugar": 10, "carbohydrates": 20, "glycemic_index": 60})
    
    return {
        "labels": labels,
        "nutrition": nutrition,
        "risk_score": risk
    }

@app.get("/barcode/{code}")
async def get_barcode_info(code: str):
    nutrition = get_food_nutrition_by_barcode(code)
    if not nutrition:
        raise HTTPException(status_code=404, detail="Product not found")
    
    risk = calculate_food_risk_score(nutrition)
    return {
        "nutrition": nutrition,
        "risk_score": risk
    }

@app.post("/predict-risk", response_model=RiskPredictionResult)
async def predict_risk(data: HealthData):
    # 1. ML Prediction
    prediction = engine.predict_diabetes_risk(data.dict())
    
    # 2. Recommendations
    recs = get_recommendations(prediction)
    
    prediction['recommendations'] = recs
    return prediction

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
