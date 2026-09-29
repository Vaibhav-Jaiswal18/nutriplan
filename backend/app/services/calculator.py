def calculate_bmi(weight_kg: float, height_cm: float):
    height_m = height_cm / 100

    bmi = weight_kg / (height_m ** 2)

    return round(bmi, 2)


def get_bmi_category(bmi: float):
    if bmi < 18.5:
        return "Underweight"

    elif bmi < 25:
        return "Normal weight"

    elif bmi < 30:
        return "Overweight"

    else:
        return "Obesity"


def calculate_bmr(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str
):
    if gender.lower() == "male":
        bmr = (
            10 * weight_kg
            + 6.25 * height_cm
            - 5 * age
            + 5
        )

    else:
        bmr = (
            10 * weight_kg
            + 6.25 * height_cm
            - 5 * age
            - 161
        )

    return round(bmr, 2)


def get_activity_multiplier(activity_level: str):

    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }

    return multipliers.get(activity_level, 1.2)


def calculate_tdee(bmr: float, activity_level: str):

    multiplier = get_activity_multiplier(activity_level)

    return round(bmr * multiplier, 2)


def calculate_goal_calories(tdee: float, goal: str):

    if goal == "lose":
        calories = tdee - 500

    elif goal == "gain":
        calories = tdee + 300

    else:
        calories = tdee

    return round(calories)


def calculate_macros(calories: int, weight_kg: float):

    protein = weight_kg * 1.6

    protein_calories = protein * 4

    fat = weight_kg * 0.8

    fat_calories = fat * 9

    remaining_calories = (
        calories
        - protein_calories
        - fat_calories
    )

    carbs = remaining_calories / 4

    return {
        "protein_g": round(protein),
        "carbs_g": round(carbs),
        "fat_g": round(fat)
    }


def calculate_water(weight_kg: float):

    water_liters = weight_kg * 0.035

    return round(water_liters, 2)