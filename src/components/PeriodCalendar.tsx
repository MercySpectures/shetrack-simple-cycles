
import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePeriodTracking } from "@/lib/period-context";

export function PeriodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { cycles, getPredictedPeriods } = usePeriodTracking();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create array for all days to display in the calendar
  // Including days from previous and next month to fill the grid
  const startDay = monthStart.getDay();
  const endDay = 6 - monthEnd.getDay();
  
  const prevMonthDays = startDay > 0 
    ? eachDayOfInterval({
        start: subMonths(monthStart, 1).setDate(monthStart.getDate() - startDay),
        end: subMonths(monthStart, 1)
      }) 
    : [];
  
  const nextMonthDays = endDay > 0 
    ? eachDayOfInterval({
        start: addMonths(monthEnd, 1),
        end: new Date(addMonths(monthEnd, 1).setDate(endDay))
      }) 
    : [];
  
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  const predictions = getPredictedPeriods(3);

  // Group days into weeks for rendering
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const isPeriodDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    return cycles.some(cycle => {
      const start = parseISO(cycle.startDate);
      const end = parseISO(cycle.endDate);
      
      return isWithinInterval(date, { start, end });
    });
  };

  const isPredictedPeriodDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    return predictions.some(period => {
      const start = parseISO(period.startDate);
      const end = parseISO(period.endDate);
      
      return isWithinInterval(date, { start, end });
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
          <div key={day} className="text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map(day => {
              const isPeriod = isPeriodDay(day);
              const isPrediction = !isPeriod && isPredictedPeriodDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "calendar-day",
                    isPeriod && "period",
                    isPrediction && "prediction",
                    isToday && "current",
                    !isCurrentMonth && "inactive"
                  )}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-xs">Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-primary/70 rounded-full"></div>
          <span className="text-xs">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/20 rounded-full"></div>
          <span className="text-xs">Today</span>
        </div>
      </div>
    </div>
  );
}
