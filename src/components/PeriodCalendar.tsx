
import React, { useState } from "react";
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
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePeriodTracking, FlowIntensity } from "@/lib/period-context"; // Added FlowIntensity import
import { Badge } from "@/components/ui/badge";

export function PeriodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { cycles, getPredictedPeriods, getFertilityWindows } = usePeriodTracking();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create array for all days to display in the calendar
  // Including days from previous and next month to fill the grid
  const startDay = monthStart.getDay();
  const endDay = 6 - monthEnd.getDay();
  
  const prevMonthDays = startDay > 0 
    ? eachDayOfInterval({
        start: new Date(subMonths(monthStart, 1).setDate(monthStart.getDate() - startDay)),
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
  const fertilityWindows = getFertilityWindows(3);

  // Group days into weeks for rendering
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const isPeriodDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return cycles.some(cycle => {
      return cycle.days.some(day => day.date === dateStr);
    });
  };

  const isPredictedPeriodDay = (date: Date) => {
    return predictions.some(period => {
      const start = parseISO(period.startDate);
      const end = parseISO(period.endDate);
      
      return isWithinInterval(date, { start, end });
    });
  };

  const isFertileDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return fertilityWindows.some(window => {
      const start = parseISO(window.fertileStart);
      const end = parseISO(window.fertileEnd);
      
      return isWithinInterval(date, { start, end });
    });
  };

  const isOvulationDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return fertilityWindows.some(window => window.ovulationDate === dateStr);
  };

  const getDayFlowIntensity = (date: Date): FlowIntensity | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    for (const cycle of cycles) {
      const periodDay = cycle.days.find(day => day.date === dateStr);
      if (periodDay) {
        return periodDay.flow;
      }
    }
    
    return null;
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
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
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
              const isFertile = !isPeriod && !isPrediction && isFertileDay(day);
              const isOvulation = !isPeriod && !isPrediction && isOvulationDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const flowIntensity = getDayFlowIntensity(day);
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "aspect-square flex items-center justify-center relative",
                    isPeriod && "bg-primary text-primary-foreground font-medium rounded-full",
                    isPrediction && "border border-primary/70 text-primary-foreground rounded-full",
                    isFertile && "border border-blue-400/70 text-blue-500 rounded-full",
                    isOvulation && "border-2 border-blue-500 text-blue-600 rounded-full font-medium",
                    isToday && !isPeriod && !isPrediction && !isFertile && !isOvulation && "bg-primary/20 rounded-full",
                    !isCurrentMonth && "text-muted-foreground/50"
                  )}
                >
                  {format(day, "d")}
                  
                  {/* Flow indicator dot */}
                  {flowIntensity && (
                    <div 
                      className={cn(
                        "absolute -bottom-1 w-2 h-2 rounded-full mx-auto",
                        flowIntensity === "light" && "bg-pink-300",
                        flowIntensity === "medium" && "bg-pink-500",
                        flowIntensity === "heavy" && "bg-pink-700"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-xs">Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-primary/70 rounded-full"></div>
          <span className="text-xs">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-blue-400/70 rounded-full"></div>
          <span className="text-xs">Fertile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
          <span className="text-xs">Ovulation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/20 rounded-full"></div>
          <span className="text-xs">Today</span>
        </div>
      </div>

      {/* Flow intensity legend */}
      <div className="mt-4 border-t pt-4">
        <p className="text-xs text-center mb-2 font-medium">Flow Intensity</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
            <span className="text-xs">Light</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-700 rounded-full"></div>
            <span className="text-xs">Heavy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
