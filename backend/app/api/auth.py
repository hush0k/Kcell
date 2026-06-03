from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.auth.jwt import AuthService
from app.database import get_db
from app.schemas.auth import Token, LoginRequest, RefreshRequest
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def get_auth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AuthService:
    return AuthService(db)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user: UserCreate, service: AuthServiceDep):
    from app.service.user import UserService
    user_service = UserService(service.db)
    return await user_service.create(user)


@router.post("/login", response_model=Token)
async def login(data: LoginRequest, service: AuthServiceDep):
    user = await service.authenticate_user(data.username, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль"
        )
    return Token(
        access_token=service.create_access_token(user.id),
        refresh_token=service.create_refresh_token(user.id)
    )


@router.post("/refresh", response_model=Token)
async def refresh(data: RefreshRequest, service: AuthServiceDep):
    new_access_token = await service.refresh_access_token(data.refresh_token)
    return Token(
        access_token=new_access_token,
        refresh_token=data.refresh_token
    )