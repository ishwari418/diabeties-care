# AI Diabetic Companion 

AI Diabetic Companion is a production-ready web application designed to help users manage diabetes using **Machine Learning** and **Rule-Based Intelligence**. It provides food safety analysis, diabetes risk prediction with explainable AI, and personalized health recommendations

---

##  Key Features

### 1.  Smart Food Scanner
*   **Image Recognition**: Identify food items using a pre-trained **MobileNetV2** CNN.
*   **Nutrition Data**: Real-time integration with the **USDA FoodData Central API**.
*   **Risk Scoring**: A rule-based engine that calculates safety levels based on sugar, carbs, and glycemic impact.

### 2.  Diabetes Risk Predictor
*   **ML Assessment**: Uses an **XGBoost** model to predict diabetes risk probability.
*   **Explainable AI (SHAP)**: Visualizes exactly how your health metrics (BMI, Glucose, Age, etc.) contribute to your risk.
*   **Logic-Driven Insights**: Provides clear, text-based explanations of the prediction.

### 3.  Personalized Recommendations
*   **Dietary Advice**: Suggestions based on food scan results and risk profiles.
*   **Exercise Plans**: Activity routines tailored to your BMI and risk category.
*   **Healthy Alternatives**: Intelligent food swaps (e.g., swapping white rice for brown rice).

### 4.  Health Dashboard
*   **Activity Tracking**: Summary of recent scans and risk predictions.
*   **Risk Trends**: Interactive charts showing your health progress over time.

---

##  Tech Stack

**Frontend:**
*   **React** (Vite)
*   **Tailwind CSS** (v4)
*   **Lucide React** (Icons)
*   **Recharts** (Data Visualization)
*   **Axios** (API Requests)

**Backend:**
*   **FastAPI** (Python)
*   **XGBoost** (Risk Prediction Model)
*   **SHAP** (ML Explainability)
*   **TensorFlow/Keras** (MobileNetV2 for Food Classification)
*   **Uvicorn** (ASGI Server)

---

##  Installation & Setup

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   USDA API Key (Get one [here](https://fdc.nal.usda.gov/api-key-signup.html))

### 1. Backend Setup
```bash
# Navigate to the root directory
# Install dependencies
py -m pip install fastapi uvicorn xgboost shap tensorflow-cpu pandas scikit-learn requests python-multipart pillow

# Train the initial risk model (Seed Data)
py backend/seed_data.py

# Start the server
py -m uvicorn backend.main:app --reload
```
*The backend will run at `http://localhost:8000`.*

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm.cmd install

# Start the development server
npm.cmd run dev
```
*The frontend will run at `http://localhost:5173`.*

---

##  Project Structure
```text
Diabetics/
├── backend/
│   ├── models/             # Saved ML models
│   ├── main.py             # FastAPI entry point
│   ├── ml_engine.py        # ML classification & prediction
│   ├── logic_engine.py     # Rule-based recommendations
│   ├── nutrition_api.py    # USDA API integration
│   └── seed_data.py        # Model training script
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, Scanner, Predictor
│   │   ├── components/     # UI components
│   │   └── App.jsx         # Main layout & routing
│   └── tailwind.config.js  # Styling configuration
└── LICENSE                 # MIT License
```

---

##  Configuration
Ensure you have your USDA API key set in `backend/nutrition_api.py`:
```python
USDA_API_KEY = "YOUR_KEY_HERE"
```

---

##  License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

##  Disclaimer
*This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.*
