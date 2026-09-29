from app.data.foods import FOODS


def get_available_meals(meal_type, diet):

    meals = FOODS.get(meal_type, [])

    if diet == "vegetarian":

        return [
            meal
            for meal in meals
            if meal["diet"] == "vegetarian"
        ]

    return meals


def generate_meal_plan(diet):

    meal_types = [
        "breakfast",
        "mid_morning",
        "lunch",
        "evening_snack",
        "dinner"
    ]

    meal_plan = []

    for meal_type in meal_types:

        meals = get_available_meals(
            meal_type,
            diet
        )

        if meals:

            selected_meal = meals[0]

            meal_plan.append({
                "meal_type": meal_type,
                "name": selected_meal["name"],
                "calories": selected_meal["calories"],
                "protein": selected_meal["protein"],
                "carbs": selected_meal["carbs"],
                "fat": selected_meal["fat"]
            })

    return meal_plan