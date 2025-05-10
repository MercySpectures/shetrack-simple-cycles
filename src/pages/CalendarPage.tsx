
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";

const CalendarPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Calendar</h1>
        <p className="text-muted-foreground text-center">Track and predict your cycle</p>
      </div>
      
      <div className="space-y-8">
        <PeriodCalendar />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-primary rounded-full mr-1"></span>
            Cycle Analysis
          </h2>
          <CycleChart />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
