import {
  DollarSign,
  CalendarDays,
  Users,
  TrendingUp,
  Shield,
  Percent,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import SectionProgress from "@/components/dashboard/SectionProgress";
import FinanceChart from "@/components/dashboard/FinanceChart";
import BudgetBreakdown from "@/components/dashboard/BudgetBreakdown";
import HrOverview from "@/components/dashboard/HrOverview";
import SupplyStatus from "@/components/dashboard/SupplyStatus";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import { kpiData } from "@/data/mockData";

const formatMoney = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} млн`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)} тыс`;
  return v.toString();
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <DashboardHeader />

        {/* KPI Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <KpiCard
            title="Бюджет освоен"
            value={`${formatMoney(kpiData.budgetSpent)} ₽`}
            subtitle={`из ${formatMoney(kpiData.budgetTotal)} ₽`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: "−8%", direction: "down" }}
          />
          <KpiCard
            title="Дней прошло"
            value={`${kpiData.daysElapsed}`}
            subtitle={`из ${kpiData.daysTotal} дней`}
            icon={<CalendarDays className="h-5 w-5" />}
            trend={{ value: "26%", direction: "neutral" }}
          />
          <KpiCard
            title="На объекте"
            value={`${kpiData.workersOnSite}`}
            subtitle={`из ${kpiData.workersTotal} чел.`}
            icon={<Users className="h-5 w-5" />}
            trend={{ value: "91%", direction: "up" }}
          />
          <KpiCard
            title="Общий прогресс"
            value={`${kpiData.overallProgress}%`}
            subtitle="фундамент"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: "+2.3%", direction: "up" }}
          />
          <KpiCard
            title="Материалы"
            value={`${kpiData.materialsDelivered}%`}
            subtitle="обеспеченность"
            icon={<Percent className="h-5 w-5" />}
            trend={{ value: "+5%", direction: "up" }}
          />
          <KpiCard
            title="Инциденты ОТ"
            value={`${kpiData.safetyIncidents}`}
            subtitle="за месяц"
            icon={<Shield className="h-5 w-5" />}
            trend={{ value: "−1", direction: "down" }}
          />
        </div>

        {/* Section Progress + Alerts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionProgress />
          </div>
          <AlertsFeed />
        </div>

        {/* Finance Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FinanceChart />
          </div>
          <BudgetBreakdown />
        </div>

        {/* HR + Supply */}
        <div className="grid gap-4 lg:grid-cols-2">
          <HrOverview />
          <SupplyStatus />
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>Источники: Прораб · Снабжение · HR · Финансы</span>
          <span className="font-mono">Google Sheets → Dashboard</span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
