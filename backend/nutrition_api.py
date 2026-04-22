import os
import requests
from dotenv import load_dotenv

load_dotenv()
USDA_API_KEY = os.getenv("USDA_API_KEY")

def get_food_nutrition_by_name(query):
    """
    Search for food items by name and return nutrition details.
    """
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?api_key={USDA_API_KEY}&query={query}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('foods'):
            return None
        
        # Get the first match
        food = data['foods'][0]
        nutrients = food.get('foodNutrients', [])
        
        nutrition = {
            "name": food.get('description'),
            "sugar": 0,
            "carbohydrates": 0,
            "calories": 0,
            "glycemic_index": 50 # USDA doesn't always provide GI, default to 50
        }
        
        for nutrient in nutrients:
            name = nutrient.get('nutrientName', '').lower()
            value = nutrient.get('value', 0)
            
            if 'sugars' in name:
                nutrition['sugar'] = value
            elif 'carbohydrate' in name:
                nutrition['carbohydrates'] = value
            elif 'energy' in name and nutrient.get('unitName') == 'KCAL':
                nutrition['calories'] = value
                
        return nutrition
    except Exception as e:
        print(f"Error fetching from USDA: {e}")
        return None

def get_food_nutrition_by_barcode(barcode):
    """
    Search for food items by barcode.
    """
    # Note: USDA API has limited barcode support compared to OpenFoodFacts
    # But we'll try searching for the barcode as a query
    return get_food_nutrition_by_name(barcode)
