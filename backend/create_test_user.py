from app.database import SessionLocal
from app.models.user import User


db = SessionLocal()

try:

    user = User(
        name="Test User",
        email="test@nutriplan.com",
        password_hash="temporary"
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    print("User created!")
    print("User ID:", user.id)

except Exception as e:

    db.rollback()

    print("Error:", e)

finally:

    db.close()