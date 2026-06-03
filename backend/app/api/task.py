from typing import Annotated, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.models.task import Status
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskList
from app.service.task import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_task_service(db: Annotated[AsyncSession, Depends(get_db)]) -> TaskService:
    return TaskService(db)


TaskServiceDep = Annotated[TaskService, Depends(get_task_service)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(
        task: TaskCreate,
        service: TaskServiceDep,
        current_user: CurrentUser,
):
    return await service.create(task, current_user.id)


@router.get("/", response_model=TaskList)
async def get_tasks(
        service: TaskServiceDep,
        current_user: CurrentUser,
        status: Optional[Status] = None,
        limit: int = 100,
):
    tasks = await service.get_all(current_user.id, status, limit)
    return TaskList(tasks=tasks, total=len(tasks))


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
        task_id: int,
        service: TaskServiceDep,
        current_user: CurrentUser,
):
    from fastapi import HTTPException, status
    task = await service.get_by_id(task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
        task_id: int,
        task_in: TaskUpdate,
        service: TaskServiceDep,
        current_user: CurrentUser,
):
    return await service.update(task_id, task_in, current_user.id)


@router.delete("/{task_id}", status_code=204)
async def delete_task(
        task_id: int,
        service: TaskServiceDep,
        current_user: CurrentUser,
):
    await service.delete(task_id, current_user.id)