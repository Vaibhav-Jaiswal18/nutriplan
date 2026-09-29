from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base


class Meal(Base):

    __tablename__ = "meals"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    diet_plan_id = Column(
        Integer,
        ForeignKey("diet_plans.id", ondelete="CASCADE"),
        nullable=False
    )

    food_id = Column(
        Integer,
        ForeignKey("foods.id"),
        nullable=False
    )

    meal_type = Column(
        String(50),
        nullable=False
    )

    quantity = Column(
        Float,
        nullable=False
    )

    calories = Column(
        Float,
        nullable=False
    )

    protein = Column(
        Float,
        nullable=False
    )

    carbs = Column(
        Float,
        nullable=False
    )

    fat = Column(
        Float,
        nullable=False
    )

    diet_plan = relationship(
        "DietPlan",
        back_populates="meals"
    )

    food = relationship(
        "Food",
        back_populates="meals"
    )