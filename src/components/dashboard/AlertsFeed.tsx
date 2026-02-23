import { alerts } from "@/data/mockData";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

const iconMap = {
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  success: CheckCircle2,
};

const colorMap = {
  warning: "text-warning border-warning/20 bg-warning/5",
  danger: "text-destructive border-destructive/20 bg-destructive/5",
  info: "text-info border-info/20 bg-info/5",
  success: "text-success border-success/20 bg-success/5",
};

const AlertsFeed = () => {
  return (
    <div className="chart-container">
      <h3 className="section-title mb-4">Уведомления</h3>
      <div className="space-y-2">
        {alerts.map((alert, i) => {
          const Icon = iconMap[alert.type];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm ${colorMap[alert.type]}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p className="text-foreground">{alert.text}</p>
                <p className="mt-0.5 text-xs opacity-60">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsFeed;
