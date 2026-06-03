from datetime import datetime
from typing import Annotated, List

from pydantic import BaseModel, Field, ConfigDict

from app.models.task import Status


class TaskCreate(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=200)]


class TaskUpdate(BaseModel):
    status: Status


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    status: Status
    user_id: int
    created_at: datetime
    updated_at: datetime


class TaskList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tasks: List[TaskResponse]
    total: int