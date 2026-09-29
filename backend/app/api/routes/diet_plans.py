from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database import get_db

from app.models.diet_plan import DietPlan
from app.models.meal import Meal

from app.schemas.nutrition import (
    NutritionRequest
)

from app.services.calculator import (
    calculate_bmi,
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
    prefix="/api/diet-plans",
    tags=["Diet Plans"]
)


@router.post("/")
def create_diet_plan(
    data: NutritionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    bmi = calculate_bmi(
        data.weight_kg,
        data.height_cm
    )

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

    # Temporary user ID.
    # Authentication will replace this later.
    

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
    )

    meal_plan = generate_diet_plan(
        db=db,
        target_calories=target_calories,
        diet=data.diet
    )

    diet_plan = DietPlan(
        user_id=current_user.id,
        target_calories=target_calories,
        protein=macros["protein_g"],
        carbs=macros["carbs_g"],
        fat=macros["fat_g"],
        water_liters=water
    )
    db.add(diet_plan)

    db.flush()

    for item in meal_plan:

        meal = Meal(
            diet_plan_id=diet_plan.id,
            food_id=item["food_id"],
            meal_type=item["meal_type"],
            quantity=item["quantity"],
            calories=item["calories"],
            protein=item["protein"],
            carbs=item["carbs"],
            fat=item["fat"]
        )

        db.add(meal)

    db.commit()

    db.refresh(diet_plan)

    return {
        "message": "Diet plan created successfully",
        "diet_plan_id": diet_plan.id,
        "target_calories": target_calories,
        "protein": macros["protein_g"],
        "carbs": macros["carbs_g"],
        "fat": macros["fat_g"],
        "water_liters": water,
        "meal_plan": meal_plan
    }

@router.get("/")
def get_my_diet_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plans = (
        db.query(DietPlan)
        .filter(DietPlan.user_id == current_user.id)
        .order_by(DietPlan.date.desc())
        .all()
    )

    return [
        {
            "id": plan.id,
            "date": plan.date,
            "target_calories": plan.target_calories,
            "protein": plan.protein,
            "carbs": plan.carbs,
            "fat": plan.fat,
            "water_liters": plan.water_liters,
        }
        for plan in plans
    ]


@router.get("/{plan_id}")
def get_diet_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = (
        db.query(DietPlan)
        .filter(
            DietPlan.id == plan_id,
            DietPlan.user_id == current_user.id
        )
        .first()
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Diet plan not found"
        )

    return {
        "id": plan.id,
        "date": plan.date,
        "target_calories": plan.target_calories,
        "protein": plan.protein,
        "carbs": plan.carbs,
        "fat": plan.fat,
        "water_liters": plan.water_liters,
        "meals": [
            {
                "id": meal.id,
                "meal_type": meal.meal_type,
                "food_id": meal.food_id,
                "quantity": meal.quantity,
                "calories": meal.calories,
                "protein": meal.protein,
                "carbs": meal.carbs,
                "fat": meal.fat,
                "food_name": meal.food.name if meal.food else None,
                "serving_size": (
                    meal.food.serving_size
                    if meal.food else None
                ),
            }
            for meal in plan.meals
        ],
    }