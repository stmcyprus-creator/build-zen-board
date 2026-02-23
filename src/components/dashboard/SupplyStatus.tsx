import { supplyData } from "@/data/mockData";
import { Package, Truck, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const statusConfig = {
  delivered: { label: "Доставлено", icon: CheckCircle2, class: "text-success" },
  in_transit: { label: "В пути", icon: Truck, class: "text-info" },
  delayed: { label: "Задержка", icon: AlertTriangle, class: "text-destructive" },
  pending: { label: "Ожидается", icon: Clock, class: "text-muted-foreground" },
};

const SupplyStatus = () => {
  return (
    <div className="chart-container">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="section-title">Снабжение</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5" />
          <span>{supplyData.items.length} позиций</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          { label: "Ожидает", value: supplyData.pending, color: "text-muted-foreground" },
          { label: "В пути", value: supplyData.inTransit, color: "text-info" },
          { label: "Доставлено", value: supplyData.delivered, color: "text-success" },
          { label: "Задержка", value: supplyData.delayed, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-secondary/50 p-2 text-center">
            <p className={`font-mono text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {supplyData.items.map((item) => {
          const cfg = statusConfig[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm transition-colors hover:bg-secondary/30"
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${cfg.class}`} />
                <span className="truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{item.qty}</span>
                <span className="font-mono">{item.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupplyStatus;
