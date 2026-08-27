import { Star } from "lucide-react";
import { Task } from "@/data/tasksData";

const PriorityBanner = ({ task }: { task?: Task }) => {
  if (!task) return null;
  return (
    <section className="flex items-start gap-3 rounded-xl border border-primary/50 bg-primary/10 p-4">
      <Star className="mt-0.5 h-5 w-5 shrink-0 fill-current text-primary" />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          Приоритетная задача · {task.projectName}
        </p>
        <p className="mt-0.5 font-medium">{task.title}</p>
        {task.assignee && <p className="text-xs text-muted-foreground">Ответственный: {task.assignee}</p>}
      </div>
    </section>
  );
};

export default PriorityBanner;
