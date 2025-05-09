
import { PeriodCalendar } from "@/components/PeriodCalendar";

const CalendarPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Track and predict your cycle</p>
      </div>
      
      <PeriodCalendar />
    </div>
  );
};

export default CalendarPage;
