
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";
import { CalendarDays, BarChart3, HeartPulse } from "lucide-react";

const CalendarPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2">
          <HeartPulse className="h-7 w-7 text-primary-foreground" />
          <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
            Calendar
          </span>
        </h1>
        <p className="text-muted-foreground">Track and predict your cycle rhythm ✨</p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
          <PeriodCalendar />
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-primary rounded-full mr-1"></span>
            <BarChart3 className="h-5 w-5 text-primary" />
            Cycle Analysis
          </h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <CycleChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
