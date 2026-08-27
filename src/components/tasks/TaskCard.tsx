import { Star, Clock, User, CalendarDays } from "lucide-react";
import { Task, TASK_STATUS_LABELS, TASK_STATUS_ORDER, TaskStatus } from "@/data/tasksData";
import { daysWaiting, formatDays } from "@/lib/tasks";

interface Props {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onTogglePriority: () => void;
}

const TaskCard = ({ task, onStatusChange, onTogglePriority }: Props) => {
  const waitingDays = task.waiting ? daysWaiting(task.waiting.waitingSince) : 0;
  const isStale = waitingDays >= 3;

  return (
    <article
      className={`rounded-xl border bg-card p-3 transition-colors ${
        task.isPriority ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
        <button
          onClick={onTogglePriority}
          aria-label={task.isPriority ? "Снять приоритет" : "Сделать приоритетной задачей"}
          title={task.isPriority ? "Снять приоритет" : "Приоритетная задача"}
          className={`shrink-0 rounded-md p-1 transition-colors ${
            task.isPriority ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Star className={`h-4 w-4 ${task.isPriority ? "fill-current" : ""}`} />
        </button>
      </div>

      {task.isPriority && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
          <Star className="h-3 w-3 fill-current" /> Приоритетная задача
        </span>
      )}

      {task.status === "waiting" && task.waiting && (
        <div
          className={`mt-2 rounded-lg border px-2 py-1.5 text-xs ${
            isStale ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-secondary/40 text-muted-foreground"
          }`}
        >
          <p className="font-medium text-foreground">
            Ждём: {task.waiting.waitingOn}
          </p>
          <p>{task.waiting.waitingFor}</p>
          <p className="mt-1 flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3" /> {formatDays(waitingDays)}
            {task.waiting.remindAt && ` · напомнить ${task.waiting.remindAt}`}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        {task.section && <span>{task.section}</span>}
        {task.assignee && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" /> {task.assignee}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1 font-mono">
            <CalendarDays className="h-3 w-3" /> {task.dueDate}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {TASK_STATUS_ORDER.filter((s) => s !== task.status).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-[11px] font-medium transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            → {TASK_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </article>
  );
};

export default TaskCard;
