import { Building2, Calendar, HardHat, Clock } from "lucide-react";
import { projectInfo } from "@/data/mockData";

const DashboardHeader = () => {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {projectInfo.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {projectInfo.address} · {projectInfo.totalArea.toLocaleString("ru-RU")} м²
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <HardHat className="h-4 w-4 text-primary" />
          <span>Стадия: <span className="font-semibold text-foreground">{projectInfo.stage}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{today}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs">Обновлено 09:15</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
