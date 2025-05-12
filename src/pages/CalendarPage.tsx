
import { useState } from "react";
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";
import { HeartPulse, CalendarDays, BarChart3 } from "lucide-react";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2 page-heading">
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 w-9 h-9 bg-pink-200 rounded-full animate-pulse opacity-50" />
            <HeartPulse className="h-7 w-7 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent ml-1">
            Calendar
          </span>
        </h1>
        <p className="text-muted-foreground">Track and predict your cycle rhythm ✨</p>
      </div>
      
      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            <CalendarDays className="h-5 w-5 text-primary" />
            Monthly Overview
          </h2>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
            <PeriodCalendar onDateSelect={setSelectedDate} />
          </div>
        </div>
          
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
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
