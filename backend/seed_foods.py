from app.database import SessionLocal
from app.models.food import Food


foods = [

    {
        "name": "Oats",
        "meal_type": "breakfast",
        "diet_type": "vegetarian",
        "serving_size": "60 g",
        "calories": 228,
        "protein": 7.8,
        "carbs": 38,
        "fat": 4.2
    },

    {
        "name": "Milk",
        "meal_type": "breakfast",
        "diet_type": "vegetarian",
        "serving_size": "250 ml",
        "calories": 150,
        "protein": 8,
        "carbs": 12,
        "fat": 8
    },

    {
        "name": "Banana",
        "meal_type": "breakfast",
        "diet_type": "vegetarian",
        "serving_size": "1 medium",
        "calories": 105,
        "protein": 1.3,
        "carbs": 27,
        "fat": 0.3
    },

    {
        "name": "Paneer",
        "meal_type": "lunch",
        "diet_type": "vegetarian",
        "serving_size": "100 g",
        "calories": 265,
        "protein": 18,
        "carbs": 6,
        "fat": 20
    },

    {
        "name": "Dal",
        "meal_type": "lunch",
        "diet_type": "vegetarian",
        "serving_size": "150 g",
        "calories": 180,
        "protein": 10,
        "carbs": 27,
        "fat": 3
    },

    {
        "name": "Roti",
        "meal_type": "lunch",
        "diet_type": "vegetarian",
        "serving_size": "1 piece",
        "calories": 100,
        "protein": 3,
        "carbs": 20,
        "fat": 1
    },

    {
        "name": "Curd",
        "meal_type": "lunch",
        "diet_type": "vegetarian",
        "serving_size": "150 g",
        "calories": 90,
        "protein": 5,
        "carbs": 7,
        "fat": 4
    },

    {
        "name": "Sprouts",
        "meal_type": "evening_snack",
        "diet_type": "vegetarian",
        "serving_size": "150 g",
        "calories": 150,
        "protein": 10,
        "carbs": 25,
        "fat": 2
    },

    {
        "name": "Roasted Chana",
        "meal_type": "evening_snack",
        "diet_type": "vegetarian",
        "serving_size": "50 g",
        "calories": 180,
        "protein": 10,
        "carbs": 30,
        "fat": 3
    },

    {
        "name": "Apple",
        "meal_type": "mid_morning",
        "diet_type": "vegetarian",
        "serving_size": "1 medium",
        "calories": 95,
        "protein": 0.5,
        "carbs": 25,
        "fat": 0.3
    },

    {
        "name": "Soya Chunks",
        "meal_type": "dinner",
        "diet_type": "vegetarian",
        "serving_size": "50 g dry",
        "calories": 170,
        "protein": 26,
        "carbs": 16,
        "fat": 1
    },

    {
        "name": "Mixed Vegetables",
        "meal_type": "dinner",
        "diet_type": "vegetarian",
        "serving_size": "200 g",
        "calories": 120,
        "protein": 5,
        "carbs": 20,
        "fat": 3
    },

    {
        "name": "Chicken Breast",
        "meal_type": "lunch",
        "diet_type": "non_vegetarian",
        "serving_size": "150 g",
        "calories": 248,
        "protein": 46,
        "carbs": 0,
        "fat": 5
    }
]


db = SessionLocal()

try:

    for food_data in foods:

        food = Food(**food_data)

        db.add(food)

    db.commit()

    print("Food data inserted successfully!")

except Exception as e:

    db.rollback()

    print("Error:", e)

finally:

    db.close()