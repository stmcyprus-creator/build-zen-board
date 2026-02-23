import { ProrabRow } from "@/lib/googleSheets";
import { sectionProgress as mockSectionProgress } from "@/data/mockData";

interface SectionProgressProps {
  prorabData?: ProrabRow[];
}

const SectionProgress = ({ prorabData }: SectionProgressProps) => {
  // If we have real data from Sheets, aggregate by section
  const sections = prorabData && prorabData.length > 0
    ? aggregateSections(prorabData)
    : mockSectionProgress;

  return (
    <div className="chart-container">
      <h3 className="section-title mb-4">Прогресс по секциям</h3>
      {sections.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Нет данных. Заполните таблицу прораба в Google Sheets.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{section.name}</span>
                  <span
                    className={`status-dot ${
                      section.status === "on_track"
                        ? "status-dot-success"
                        : "status-dot-warning"
                    }`}
                  />
                </div>
                <span className="font-mono text-sm font-semibold text-primary">
                  {section.progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${section.progress}%` }}
                />
              </div>
              <div className="space-y-2">
                {section.tasks.map((task) => (
                  <div key={task.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{task.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor:
                              task.progress === 100
                                ? "hsl(var(--success))"
                                : task.progress > 0
                                ? "hsl(var(--primary))"
                                : "hsl(var(--muted))",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-xs">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Aggregate flat prоrab rows into section progress structure */
function aggregateSections(rows: ProrabRow[]) {
  const sectionMap = new Map<string, { tasks: Map<string, number[]>; totalProgress: number[] }>();

  for (const row of rows) {
    const sectionKey = row.section || "Без секции";
    if (!sectionMap.has(sectionKey)) {
      sectionMap.set(sectionKey, { tasks: new Map(), totalProgress: [] });
    }
    const sec = sectionMap.get(sectionKey)!;
    const taskKey = row.workType || row.description || "Работы";
    if (!sec.tasks.has(taskKey)) {
      sec.tasks.set(taskKey, []);
    }
    sec.tasks.get(taskKey)!.push(row.progress);
    sec.totalProgress.push(row.progress);
  }

  return Array.from(sectionMap.entries()).map(([key, sec]) => {
    const avgProgress = Math.round(
      sec.totalProgress.reduce((a, b) => a + b, 0) / sec.totalProgress.length
    );
    return {
      id: key,
      name: key.startsWith("Секция") ? key : `Секция ${key}`,
      progress: avgProgress,
      status: (avgProgress >= 15 ? "on_track" : "delayed") as "on_track" | "delayed",
      tasks: Array.from(sec.tasks.entries()).map(([name, progresses]) => ({
        name,
        progress: Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length),
      })),
    };
  });
}

export default SectionProgress;
