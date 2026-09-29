from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base


class DietPlan(Base):

    __tablename__ = "diet_plans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    date = Column(
        DateTime,
        default=datetime.utcnow
    )

    target_calories = Column(
        Integer,
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

    water_liters = Column(
        Float,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="diet_plans"
    )

    meals = relationship(
        "Meal",
        back_populates="diet_plan",
        cascade="all, delete-orphan"
    )