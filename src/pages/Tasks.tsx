import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ListChecks } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/tasks/TaskCard";
import WaitingDialog from "@/components/tasks/WaitingDialog";
import PriorityBanner from "@/components/tasks/PriorityBanner";
import { Task, TASK_STATUS_LABELS, TASK_STATUS_ORDER, TaskStatus, TaskWaitingInfo } from "@/data/tasksData";

const Tasks = () => {
  const navigate = useNavigate();
  const { canAccess } = useRole();
  const { tasks, isMock, setStatus, setPriority } = useTasks();
  const [waitingTask, setWaitingTask] = useState<Task | null>(null);

  const columns = useMemo(
    () =>
      TASK_STATUS_ORDER.map((status) => ({
        status,
        items: tasks.filter((t) => t.status === status),
      })),
    [tasks],
  );

  const priorityTask = tasks.find((t) => t.isPriority);

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    if (status === "waiting") {
      setWaitingTask(task);
      return;
    }
    setStatus(task.id, status);
  };

  const handleWaitingSubmit = (info: TaskWaitingInfo) => {
    if (waitingTask) setStatus(waitingTask.id, "waiting", info);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        {canAccess("/") && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Назад к дашборду
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ListChecks className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Задачи объекта</h1>
            <p className="text-sm text-muted-foreground">
              Канбан со статусом «Ожидание» и приоритетной задачей
              {isMock && " · демонстрационные данные"}
            </p>
          </div>
        </div>

        <PriorityBanner task={priorityTask} />

        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map(({ status, items }) => (
            <section key={status} className="rounded-xl border border-border bg-card/40 p-3">
              <header className="mb-3 flex items-center justify-between">
                <h2 className="section-title">{TASK_STATUS_LABELS[status]}</h2>
                <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
              </header>
              <div className="space-y-3">
                {items.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(s) => handleStatusChange(task, s)}
                    onTogglePriority={() => setPriority(task.id, task.projectId, !task.isPriority)}
                  />
                ))}
                {items.length === 0 && (
                  <p className="py-6 text-center text-xs text-muted-foreground">Нет задач</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <WaitingDialog
        task={waitingTask}
        open={Boolean(waitingTask)}
        onOpenChange={(open) => !open && setWaitingTask(null)}
        onSubmit={handleWaitingSubmit}
      />
    </div>
  );
};

export default Tasks;
