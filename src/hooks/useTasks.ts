import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Task, TaskStatus, TaskWaitingInfo, mockTasks } from "@/data/tasksData";
import { fetchTasks, setPriorityTask, updateTaskStatus } from "@/lib/tasks";

/**
 * Задачи объекта. Если таблицы tasks ещё нет в БД, работаем на мок-данных
 * локально (оптимистично), чтобы UI оставался рабочим.
 */
export function useTasks() {
  const qc = useQueryClient();
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null);

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const isMock = query.data?.isMock ?? true;
  const tasks = localTasks ?? query.data?.tasks ?? mockTasks;

  const applyLocal = useCallback(
    (fn: (prev: Task[]) => Task[]) => setLocalTasks((prev) => fn(prev ?? query.data?.tasks ?? mockTasks)),
    [query.data],
  );

  const statusMutation = useMutation({
    mutationFn: async (vars: { taskId: string; status: TaskStatus; waiting?: TaskWaitingInfo | null }) => {
      if (!isMock) await updateTaskStatus(vars.taskId, vars.status, vars.waiting);
    },
    onMutate: undefined,
    onSuccess: () => {
      if (!isMock) qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const setStatus = useCallback(
    (taskId: string, status: TaskStatus, waiting?: TaskWaitingInfo | null) => {
      applyLocal((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status, waiting: status === "waiting" ? waiting ?? t.waiting ?? null : null }
            : t,
        ),
      );
      statusMutation.mutate({ taskId, status, waiting });
    },
    [applyLocal, statusMutation],
  );

  const priorityMutation = useMutation({
    mutationFn: async (vars: { taskId: string; projectId: string; value: boolean }) => {
      if (!isMock) await setPriorityTask(vars.taskId, vars.projectId, vars.value);
    },
    onSuccess: () => {
      if (!isMock) qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /** Только одна приоритетная задача на объект */
  const setPriority = useCallback(
    (taskId: string, projectId: string, value: boolean) => {
      applyLocal((prev) =>
        prev.map((t) => {
          if (t.id === taskId) return { ...t, isPriority: value };
          if (value && t.projectId === projectId) return { ...t, isPriority: false };
          return t;
        }),
      );
      priorityMutation.mutate({ taskId, projectId, value });
    },
    [applyLocal, priorityMutation],
  );

  return { tasks, isMock, isLoading: query.isLoading, setStatus, setPriority };
}
