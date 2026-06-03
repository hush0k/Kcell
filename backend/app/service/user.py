from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.user import UserCreate, UserResponse


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def create(self, user: UserCreate) -> UserResponse:
