from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully.")
    
    db = SessionLocal()
    user = db.query(User).filter(User.email == "admin@faqflow.com").first()
    if not user:
        admin_user = User(
            email="admin@faqflow.com",
            hashed_password=get_password_hash("admin123"),
            is_superuser=True,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        print("Created default admin user: admin@faqflow.com / admin123")
    db.close()

if __name__ == "__main__":
    init_db()
