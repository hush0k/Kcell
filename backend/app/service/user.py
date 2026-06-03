from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.security import hash_password
from app.models import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user: UserCreate) -> User:
        existing_user = await self.db.execute(select(User).where(User.username == user.username))
        if existing_user.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

        db_user = User(
            **user.model_dump(exclude={"password"}),
            hashed_password=hash_password(user.password),
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user


    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_all(self) -> list[User]:
        result = await self.db.execute(select(User))
        return list(result.scalars().all())

    async def update(self, user_in: UserUpdate, user_id: int) -> Optional[User]:
        user = await self.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        updated_user = user_in.model_dump(exclude_unset=True)

        for key, value in updated_user.items():
            setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, user_id: int):
        user = await self.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        await self.db.delete(user)
        await self.db.commit()