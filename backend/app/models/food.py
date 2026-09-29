from sqlalchemy import (
    Column,
    Integer,
    String,
    Float
)

from sqlalchemy.orm import relationship

from app.database import Base


class Food(Base):

    __tablename__ = "foods"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(150),
        nullable=False
    )

    meal_type = Column(
        String(50),
        nullable=False
    )

    diet_type = Column(
        String(30),
        nullable=False
    )

    serving_size = Column(
        String(100),
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

    meals = relationship(
        "Meal",
        back_populates="food"
    )