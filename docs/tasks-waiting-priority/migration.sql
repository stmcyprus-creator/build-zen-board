-- Статус "Ожидание" (waiting) + пометка "Приоритетная задача"
-- Применять на бэкенде (Alembic/psql). Схема public, Supabase/PostgREST.

BEGIN;

-- 1. Статус waiting -----------------------------------------------------------
-- Вариант А: если status — enum task_status
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'task_status' AND e.enumlabel = 'waiting'
    ) THEN
      ALTER TYPE task_status ADD VALUE 'waiting';
    END IF;
  END IF;
END $$;

-- Вариант Б: если status — text с CHECK-констрейнтом
-- ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
-- ALTER TABLE public.tasks ADD CONSTRAINT tasks_status_check
--   CHECK (status IN ('todo','in_progress','waiting','done'));

-- 2. Приоритетная задача ------------------------------------------------------
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS is_priority boolean NOT NULL DEFAULT false;

-- Не более одной приоритетной задачи на объект
CREATE UNIQUE INDEX IF NOT EXISTS tasks_one_priority_per_project
  ON public.tasks (project_id)
  WHERE is_priority;

CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks (status);

-- 3. Детали ожидания ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.task_waiting_info (
  task_id uuid PRIMARY KEY REFERENCES public.tasks(id) ON DELETE CASCADE,
  waiting_on_text text NOT NULL,          -- кого ждём
  waiting_for_text text NOT NULL,         -- что именно ждём
  waiting_since date NOT NULL DEFAULT current_date,
  remind_at date,                         -- когда напомнить (Telegram)
  reminded_at timestamptz,                -- когда напоминание отправлено
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_waiting_info TO authenticated;
GRANT ALL ON public.task_waiting_info TO service_role;

ALTER TABLE public.task_waiting_info ENABLE ROW LEVEL SECURITY;

-- Доступ к деталям ожидания = доступ к самой задаче
CREATE POLICY "waiting_info_select" ON public.task_waiting_info
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id));

CREATE POLICY "waiting_info_write" ON public.task_waiting_info
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id));

CREATE INDEX IF NOT EXISTS task_waiting_info_remind_idx
  ON public.task_waiting_info (remind_at) WHERE reminded_at IS NULL;

COMMIT;

-- Откат:
-- DROP TABLE IF EXISTS public.task_waiting_info;
-- DROP INDEX IF EXISTS public.tasks_one_priority_per_project;
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS is_priority;
-- (значение enum 'waiting' в PostgreSQL удалить нельзя — потребуется пересоздание типа)
