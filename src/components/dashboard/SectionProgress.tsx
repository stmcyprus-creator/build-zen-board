import { sectionProgress } from "@/data/mockData";

const SectionProgress = () => {
  return (
    <div className="chart-container">
      <h3 className="section-title mb-4">Прогресс по секциям</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {sectionProgress.map((section) => (
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
    </div>
  );
};

export default SectionProgress;
