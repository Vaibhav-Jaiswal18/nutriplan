from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.nutrition import (
    NutritionRequest,
    NutritionResponse
)

from app.database import get_db

from app.services.calculator import (
    calculate_bmi,
    get_bmi_category,
    calculate_bmr,
    calculate_tdee,
    calculate_goal_calories,
    calculate_macros,
    calculate_water
)

from app.services.diet_planner import (
    generate_diet_plan
)


router = APIRouter(
    prefix="/api/nutrition",
    tags=["Nutrition"]
)


@router.post(
    "/calculate",
    response_model=NutritionResponse
)
def calculate_nutrition(
    data: NutritionRequest,
    db: Session = Depends(get_db)
):

    bmi = calculate_bmi(
        data.weight_kg,
        data.height_cm
    )

    bmi_category = get_bmi_category(bmi)

    bmr = calculate_bmr(
        data.weight_kg,
        data.height_cm,
        data.age,
        data.gender
    )

    tdee = calculate_tdee(
        bmr,
        data.activity_level
    )

    target_calories = calculate_goal_calories(
        tdee,
        data.goal
    )

    macros = calculate_macros(
        target_calories,
        data.weight_kg
    )

    water = calculate_water(
        data.weight_kg
    )

    meal_plan = generate_diet_plan(
        db=db,
        target_calories=target_calories,
        diet=data.diet
    )

    return {
        "bmi": bmi,
        "bmi_category": bmi_category,
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target_calories,
        "protein_g": macros["protein_g"],
        "carbs_g": macros["carbs_g"],
        "fat_g": macros["fat_g"],
        "water_liters": water,
        "meal_plan": meal_plan
    }