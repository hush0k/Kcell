from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Task
from app.models.task import Status
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, task: TaskCreate, user_id: int) -> Task:
        db_task = Task(
            title=task.title,
            status=Status.PENDING,
            user_id=user_id,
        )
        self.db.add(db_task)
        await self.db.commit()
        await self.db.refresh(db_task)
        return db_task

    async def get_by_id(self, task_id: int) -> Optional[Task]:
        result = await self.db.execute(select(Task).where(Task.id == task_id))
        return result.scalar_one_or_none()

    async def get_all(self, user_id: int, task_status: Optional[Status] = None, limit: int = 100) -> list[Task]:
        query = select(Task).where(Task.user_id == user_id)
        if task_status:
            query = query.where(Task.status == task_status)
        query = query.limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update(self, task_id: int, task_in: TaskUpdate, user_id: int) -> Optional[Task]:
        task = await self.get_by_id(task_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        if task.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

        updated_task = task_in.model_dump(exclude_unset=True)
        for key, value in updated_task.items():
            setattr(task, key, value)

        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def delete(self, task_id: int, user_id: int):
        task = await self.get_by_id(task_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        if task.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

        await self.db.delete(task)
        await self.db.commit()