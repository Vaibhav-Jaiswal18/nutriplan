from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base


class Profile(Base):

    __tablename__ = "profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    gender = Column(
        String(20),
        nullable=False
    )

    height_cm = Column(
        Float,
        nullable=False
    )

    weight_kg = Column(
        Float,
        nullable=False
    )

    activity_level = Column(
        String(30),
        nullable=False
    )

    goal = Column(
        String(30),
        nullable=False
    )

    diet = Column(
        String(30),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="profile"
    )