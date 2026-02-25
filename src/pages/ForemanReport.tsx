import { ArrowLeft, ClipboardList, Calendar, User, MapPin, Layers, AlertTriangle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";

const ForemanReport = () => {
  const navigate = useNavigate();
  const { data: sheetsData, isLoading } = useGoogleSheets();

  const rows = sheetsData?.prorab ?? [];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Отчёт прораба</h1>
              <p className="text-sm text-muted-foreground">Ежедневные записи с объекта</p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            Загрузка данных...
          </div>
        )}

        {!isLoading && rows.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            <ClipboardList className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="font-medium">Нет записей</p>
            <p className="mt-1 text-sm">Данные из листа прораба пока не загружены</p>
          </div>
        )}

        {rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {row.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    Секция {row.section}
                  </span>
                  {row.floor && (
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {row.floor}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {row.executor || "—"}
                  </span>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {row.progress}%
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium text-foreground">{row.workType}</p>
                  {row.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{row.description}</p>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="text-muted-foreground">
                    👷 {row.workerCount} чел.
                  </span>
                  {row.issues && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {row.issues}
                    </span>
                  )}
                  {row.notes && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {row.notes}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForemanReport;
