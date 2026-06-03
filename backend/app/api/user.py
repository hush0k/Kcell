from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user
from app.database import get_db
from app.schemas.user import UserResponse, UserCreate, UserUpdate
from app.service.user import UserService

router = APIRouter(
    prefix="/api/user",
    tags=["User"],
)


def get_user_service(db: Annotated[AsyncSession, Depends(get_db)]) -> UserService:
    return UserService(db)


ServiceDep = Annotated[UserService, Depends(get_user_service)]

@router.get("/", response_model=list[UserResponse])
async def get_all_users(service: ServiceDep):
    return await service.get_all()

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, service: ServiceDep):
    return await service.get_by_id(user_id)


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate, service: ServiceDep):
    return await service.create(user)

@router.patch("/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_user)])
async def update_user(user_id: int, user: UserUpdate, service: ServiceDep):
    return await service.update(user, user_id)

@router.delete("/{user_id}", dependencies=[Depends(get_current_user)], status_code=204)
async def delete_user(user_id: int, service: ServiceDep):
    return await service.delete(user_id)
