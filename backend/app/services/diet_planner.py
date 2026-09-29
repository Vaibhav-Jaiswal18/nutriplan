from sqlalchemy.orm import Session

from app.models.food import Food


MEAL_DISTRIBUTION = {
    "breakfast": 0.25,
    "mid_morning": 0.10,
    "lunch": 0.30,
    "evening_snack": 0.10,
    "dinner": 0.25
}


def get_foods_for_meal(
    db: Session,
    meal_type: str,
    diet: str
):

    query = db.query(Food).filter(
        Food.meal_type == meal_type
    )

    if diet == "vegetarian":
        query = query.filter(
            Food.diet_type == "vegetarian"
        )

    return query.all()


def select_foods(
    foods,
    target_calories
):

    if not foods:
        return []

    selected = []

    remaining = target_calories

    # Sort foods by calories, largest first
    foods = sorted(
        foods,
        key=lambda food: food.calories,
        reverse=True
    )

    for food in foods:

        if remaining <= 50:
            break

        quantity = remaining / food.calories

        # Keep portions realistic
        quantity = min(quantity, 2.0)

        if quantity < 0.5:
            continue

        calories = food.calories * quantity

        selected.append({
            "food": food,
            "quantity": round(quantity, 2),
            "calories": round(calories, 1),
            "protein": round(
                food.protein * quantity,
                1
            ),
            "carbs": round(
                food.carbs * quantity,
                1
            ),
            "fat": round(
                food.fat * quantity,
                1
            )
        })

        remaining -= calories

    return selected


def generate_diet_plan(
    db: Session,
    target_calories: int,
    diet: str
):

    plan = []

    for meal_type, percentage in MEAL_DISTRIBUTION.items():

        meal_target = round(
            target_calories * percentage
        )

        foods = get_foods_for_meal(
            db,
            meal_type,
            diet
        )

        selected_foods = select_foods(
            foods,
            meal_target
        )

        for item in selected_foods:

            food = item["food"]

            plan.append({
                "meal_type": meal_type,
                "food_id": food.id,
                "food_name": food.name,
                "serving_size": food.serving_size,
                "quantity": item["quantity"],
                "calories": item["calories"],
                "protein": item["protein"],
                "carbs": item["carbs"],
                "fat": item["fat"]
            })

    return plan