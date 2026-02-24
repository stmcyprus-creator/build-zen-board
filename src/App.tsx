import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BudgetReport from "./pages/BudgetReport";
import ScheduleReport from "./pages/ScheduleReport";
import WorkersReport from "./pages/WorkersReport";
import ProgressReport from "./pages/ProgressReport";
import MaterialsReport from "./pages/MaterialsReport";
import SafetyReport from "./pages/SafetyReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/budget" element={<BudgetReport />} />
          <Route path="/schedule" element={<ScheduleReport />} />
          <Route path="/workers" element={<WorkersReport />} />
          <Route path="/progress" element={<ProgressReport />} />
          <Route path="/materials" element={<MaterialsReport />} />
          <Route path="/safety" element={<SafetyReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
