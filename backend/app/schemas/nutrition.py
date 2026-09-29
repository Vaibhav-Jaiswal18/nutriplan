from pydantic import BaseModel, Field


class NutritionRequest(BaseModel):

    age: int = Field(..., ge=13, le=100)

    gender: str

    height_cm: float = Field(..., gt=100, lt=250)

    weight_kg: float = Field(..., gt=25, lt=300)

    activity_level: str

    goal: str

    diet: str


class Meal(BaseModel):

    meal_type: str

    food_id: int

    food_name: str

    serving_size: str

    quantity: float

    calories: float

    protein: float

    carbs: float

    fat: float


class NutritionResponse(BaseModel):

    bmi: float

    bmi_category: str

    bmr: float

    tdee: float

    target_calories: int

    protein_g: int

    carbs_g: int

    fat_g: int

    water_liters: float

    meal_plan: list[Meal]