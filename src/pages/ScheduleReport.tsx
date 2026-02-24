import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { kpiData } from "@/data/mockData";

const ScheduleReport = () => {
  const navigate = useNavigate();
  const pct = Math.round((kpiData.daysElapsed / kpiData.daysTotal) * 100);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Назад к дашборду
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Сроки проекта</h1>
            <p className="text-sm text-muted-foreground">Календарный план и отклонения</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Прошло дней", value: `${kpiData.daysElapsed}`, sub: `${pct}% срока` },
            { label: "Осталось дней", value: `${kpiData.daysTotal - kpiData.daysElapsed}`, sub: `${100 - pct}% срока` },
            { label: "Общий срок", value: `${kpiData.daysTotal} дн.`, sub: "по контракту" },
          ].map((item) => (
            <div key={item.label} className="kpi-card">
              <p className="section-title">{item.label}</p>
              <p className="value-large mt-1">{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 className="section-title mb-4">Прогресс по времени</h3>
          <div className="progress-bar h-4">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Старт</span>
            <span>{pct}% срока прошло</span>
            <span>Финиш</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleReport;
