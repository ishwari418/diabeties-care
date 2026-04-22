import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os

def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    data = {
        'Age': np.random.randint(18, 80, n_samples),
        'BMI': np.random.uniform(18, 45, n_samples),
        'Glucose': np.random.randint(70, 250, n_samples),
        'BloodPressure': np.random.randint(60, 140, n_samples),
        'Insulin': np.random.randint(0, 300, n_samples),
        'PhysicalActivity': np.random.randint(0, 11, n_samples),
        'DietType': np.random.randint(0, 3, n_samples), # 0: Low Carb, 1: Balanced, 2: High Carb
        'Smoking': np.random.randint(0, 2, n_samples),
        'FamilyHistory': np.random.randint(0, 2, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Simple logic to determine outcome
    # Glucose > 140, BMI > 30, Age > 45, FamilyHistory=1 increase risk
    risk_score = (
        (df['Glucose'] - 100) / 50 + 
        (df['BMI'] - 25) / 10 + 
        (df['Age'] - 40) / 20 + 
        df['FamilyHistory'] * 1.5 +
        df['Smoking'] * 0.5 -
        df['PhysicalActivity'] * 0.2
    )
    
    # Sigmoid to get probability
    prob = 1 / (1 + np.exp(-risk_score))
    df['Outcome'] = (prob > 0.5).astype(int)
    
    return df

def train_model():
    print("Generating data...")
    df = generate_synthetic_data(2000)
    
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost model...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2f}")
    
    # Save model
    model_path = os.path.join('backend', 'models', 'diabetes_model.json')
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    model.save_model(model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
