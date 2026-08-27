import { supabase } from "./supabaseClient";
import {
  mockTasks,
  Task,
  TaskStatus,
  TaskWaitingInfo,
} from "@/data/tasksData";

/** Строка таблицы tasks (см. docs/tasks-waiting-priority/migration.sql) */
interface TaskRow {
  id: string;
  title: string;
  project_id: string | null;
  project_name?: string | null;
  section?: string | null;
  assignee?: string | null;
  due_date?: string | null;
  status: TaskStatus;
  is_priority: boolean | null;
  task_waiting_info?: WaitingRow | WaitingRow[] | null;
}

interface WaitingRow {
  task_id: string;
  waiting_on_text: string | null;
  waiting_for_text: string | null;
  waiting_since: string | null;
  remind_at: string | null;
}

function mapWaiting(raw: TaskRow["task_waiting_info"]): TaskWaitingInfo | null {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row) return null;
  return {
    waitingOn: row.waiting_on_text ?? "",
    waitingFor: row.waiting_for_text ?? "",
    waitingSince: row.waiting_since ?? new Date().toISOString().slice(0, 10),
    remindAt: row.remind_at ?? null,
  };
}

function mapTask(r: TaskRow): Task {
  return {
    id: r.id,
    title: r.title,
    projectId: r.project_id ?? "—",
    projectName: r.project_name ?? "Объект",
    section: r.section ?? undefined,
    assignee: r.assignee ?? undefined,
    dueDate: r.due_date ?? null,
    status: r.status,
    isPriority: Boolean(r.is_priority),
    waiting: mapWaiting(r.task_waiting_info),
  };
}

/** Читает задачи из БД; при отсутствии таблицы/данных возвращает мок-набор. */
export async function fetchTasks(): Promise<{ tasks: Task[]; isMock: boolean }> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, task_waiting_info(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return { tasks: mockTasks, isMock: true };
    return { tasks: (data as TaskRow[]).map(mapTask), isMock: false };
  } catch {
    return { tasks: mockTasks, isMock: true };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  waiting?: TaskWaitingInfo | null,
): Promise<void> {
  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);
  if (error) throw new Error(error.message);

  if (status === "waiting" && waiting) {
    const { error: wErr } = await supabase.from("task_waiting_info").upsert(
      {
        task_id: taskId,
        waiting_on_text: waiting.waitingOn,
        waiting_for_text: waiting.waitingFor,
        waiting_since: waiting.waitingSince,
        remind_at: waiting.remindAt ?? null,
      },
      { onConflict: "task_id" },
    );
    if (wErr) throw new Error(wErr.message);
  } else if (status !== "waiting") {
    await supabase.from("task_waiting_info").delete().eq("task_id", taskId);
  }
}

/** Одна приоритетная задача на объект: снимаем флаг у остальных. */
export async function setPriorityTask(taskId: string, projectId: string, value: boolean): Promise<void> {
  if (value) {
    const { error: clearErr } = await supabase
      .from("tasks")
      .update({ is_priority: false })
      .eq("project_id", projectId)
      .neq("id", taskId);
    if (clearErr) throw new Error(clearErr.message);
  }
  const { error } = await supabase.from("tasks").update({ is_priority: value }).eq("id", taskId);
  if (error) throw new Error(error.message);
}

/** Сколько дней задача висит в ожидании */
export function daysWaiting(since: string): number {
  const start = new Date(since + "T00:00:00");
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.max(diff, 0);
}

export function formatDays(n: number): string {
  const last = n % 10;
  const tens = Math.floor((n % 100) / 10);
  if (tens === 1) return `${n} дней`;
  if (last === 1) return `${n} день`;
  if (last >= 2 && last <= 4) return `${n} дня`;
  return `${n} дней`;
}
