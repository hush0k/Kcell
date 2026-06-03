import enum

from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.user import User
from app.models.mixins import TimestampMixin


class Status(enum.StrEnum):
    PENDING = "pending"
    DONE = "done"

class Task(Base, TimestampMixin):
    __tablename__ = "task"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[Status] = mapped_column(SAEnum(Status), nullable=False)

    user: Mapped[User] = relationship("User", back_populates="tasks")


