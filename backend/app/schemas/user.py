import re
from datetime import datetime
from typing import Annotated, List

from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator


def validate_strong_password(password: str) -> str:
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(pattern, password):
        raise ValueError(
            "Пароль должен содержать: "
            "минимум 8 символов, заглавную букву, "
            "строчную букву, цифру и спецсимвол"
        )
    return password

class UserBase(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=50)]
    first_name: Annotated[str, Field(min_length=3, max_length=50)]
    last_name: Annotated[str, Field(min_length=3, max_length=50)]

class UserCreate(UserBase):
    hashed_password: Annotated[str, Field(min_length=8, max_length=100)]

    @field_validator("hashed_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_strong_password(v)

class UserUpdate(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=50)] = None
    first_name: Annotated[str, Field(min_length=3, max_length=50)] = None
    last_name: Annotated[str, Field(min_length=3, max_length=50)] = None

class UserUpdatePassword(BaseModel):
    old_password: str
    new_password: str
    repeat_new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_strong_password(v)

    @model_validator(mode="after")
    def validate_passwords_match(self) -> "UserUpdatePassword":
        if self.new_password != self.repeat_new_password:
            raise ValueError("Пароли не совпадают")
        return self

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime

class UserList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    users: List[UserResponse]
    total: int
