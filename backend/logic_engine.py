def calculate_food_risk_score(nutrition_data):
    """
    Risk Score = weighted(sugar, carbs, glycemic index)
    Output: Safe, Moderate, Risky
    """
    sugar = nutrition_data.get('sugar', 0)
    carbs = nutrition_data.get('carbohydrates', 0)
    gi = nutrition_data.get('glycemic_index', 50) # Default to 50 if unknown
    
    # Simple weighted score
    # Normalize: sugar (0-50), carbs (0-100), gi (0-100)
    score = (sugar * 2) + (carbs * 0.5) + (gi * 0.3)
    
    risk_level = "Safe"
    color = "green"
    explanation = []
    
    if score > 40:
        risk_level = "Risky"
        color = "red"
        explanation.append("High sugar and carbohydrate content significantly increases glucose levels.")
    elif score > 20:
        risk_level = "Moderate"
        color = "yellow"
        explanation.append("Moderate carbohydrate levels may cause a gradual rise in glucose.")
    else:
        risk_level = "Safe"
        color = "green"
        explanation.append("Low glycemic impact makes this food safer for consumption.")
        
    if gi > 70:
        explanation.append("High glycemic index indicates rapid sugar absorption.")
    elif gi < 55:
        explanation.append("Low glycemic index helps maintain stable blood sugar.")
        
    return {
        "risk_level": risk_level,
        "score": round(score, 1),
        "color": color,
        "explanations": explanation
    }

def get_recommendations(risk_prediction, food_scan=None):
    """
    risk_prediction: { 'risk_percentage': float, 'category': str, 'key_factors': list }
    food_scan: result from calculate_food_risk_score
    """
    recs = {
        "diet": [],
        "exercise": [],
        "alternatives": []
    }
    
    # Logic based on risk prediction
    if risk_prediction['category'] == 'High':
        recs['diet'].append("Focus on high-fiber, low-glycemic index foods like leafy greens and legumes.")
        recs['exercise'].append("Engage in at least 30 minutes of moderate aerobic activity daily (e.g., brisk walking).")
    elif risk_prediction['category'] == 'Medium':
        recs['diet'].append("Monitor portion sizes of complex carbohydrates.")
        recs['exercise'].append("Aim for regular physical activity, including strength training twice a week.")
    else:
        recs['diet'].append("Maintain a balanced diet rich in whole grains and lean proteins.")
        recs['exercise'].append("Keep up your current activity level to maintain health.")

    # Logic based on BMI (if available in risk_prediction data)
    # Note: risk_prediction should ideally contain the input features
    
    # Logic based on food scan
    if food_scan and food_scan['risk_level'] == 'Risky':
        recs['alternatives'].append("Replace sugary snacks with nuts or seeds.")
        recs['alternatives'].append("Substitute white rice or bread with brown rice or whole-wheat alternatives.")
        recs['diet'].append("Consider smaller portions of this food if consumed.")
    
    return recs
