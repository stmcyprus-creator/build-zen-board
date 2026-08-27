"""Pydantic-схемы и хелперы для статуса "Ожидание" и приоритетной задачи.

Артефакт для FastAPI-бэкенда (лежит вне этого репозитория).
"""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    waiting = "waiting"
    done = "done"


class TaskWaitingInfoBase(BaseModel):
    waiting_on_text: str = Field(..., min_length=1, max_length=200, description="Кого ждём")
    waiting_for_text: str = Field(..., min_length=1, max_length=500, description="Что именно ждём")
    waiting_since: date = Field(default_factory=date.today)
    remind_at: Optional[date] = Field(default=None, description="Когда напомнить")


class TaskWaitingInfoCreate(TaskWaitingInfoBase):
    pass


class TaskWaitingInfoRead(TaskWaitingInfoBase):
    task_id: UUID
    reminded_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    @property
    def days_waiting(self) -> int:
        return max((date.today() - self.waiting_since).days, 0)


class TaskStatusUpdate(BaseModel):
    """PATCH /tasks/{id}/status — при waiting детали обязательны."""

    status: TaskStatus
    waiting_info: Optional[TaskWaitingInfoCreate] = None

    @model_validator(mode="after")
    def check_waiting(self) -> "TaskStatusUpdate":
        if self.status is TaskStatus.waiting and self.waiting_info is None:
            raise ValueError("Для статуса 'waiting' нужно указать waiting_info")
        if self.status is not TaskStatus.waiting and self.waiting_info is not None:
            raise ValueError("waiting_info допустим только для статуса 'waiting'")
        return self


class TaskPriorityUpdate(BaseModel):
    """PATCH /tasks/{id}/priority — одна приоритетная задача на объект."""

    is_priority: bool


class TaskRead(BaseModel):
    id: UUID
    project_id: UUID
    title: str
    section: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[date] = None
    status: TaskStatus
    is_priority: bool = False
    waiting_info: Optional[TaskWaitingInfoRead] = None

    model_config = {"from_attributes": True}


# --- Сервисный слой (SQLAlchemy, псевдо-репозиторий) -------------------------

async def set_task_status(session, task, payload: TaskStatusUpdate, WaitingInfo) -> None:
    """Меняет статус; при waiting сохраняет детали, иначе удаляет их."""
    task.status = payload.status.value
    if payload.status is TaskStatus.waiting:
        info = await session.get(WaitingInfo, task.id)
        data = payload.waiting_info.model_dump()
        if info is None:
            session.add(WaitingInfo(task_id=task.id, **data))
        else:
            for key, value in data.items():
                setattr(info, key, value)
            info.updated_at = datetime.utcnow()
    else:
        info = await session.get(WaitingInfo, task.id)
        if info is not None:
            await session.delete(info)
    await session.commit()


async def set_priority_task(session, task, payload: TaskPriorityUpdate, Task) -> None:
    """Снимает приоритет с остальных задач объекта (partial unique index)."""
    from sqlalchemy import update

    if payload.is_priority:
        await session.execute(
            update(Task)
            .where(Task.project_id == task.project_id, Task.id != task.id)
            .values(is_priority=False)
        )
    task.is_priority = payload.is_priority
    await session.commit()


async def due_waiting_reminders(session, WaitingInfo):
    """Задачи, по которым пора отправить напоминание в Telegram."""
    from sqlalchemy import select

    stmt = select(WaitingInfo).where(
        WaitingInfo.remind_at <= date.today(),
        WaitingInfo.reminded_at.is_(None),
    )
    return (await session.execute(stmt)).scalars().all()
