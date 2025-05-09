
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";

const CalendarPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Track and predict your cycle</p>
      </div>
      
      <div className="space-y-8">
        <PeriodCalendar />
        <CycleChart />
      </div>
    </div>
  );
};

export default CalendarPage;
