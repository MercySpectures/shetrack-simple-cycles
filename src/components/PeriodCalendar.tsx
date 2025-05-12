
import React, { useState, useCallback } from "react";
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
import { ChevronLeft, ChevronRight, CalendarDays, Droplets, Sparkles, Egg } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePeriodTracking } from "@/lib/period-context";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlowIntensity } from "@/lib/types";

interface PeriodCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export function PeriodCalendar({ onDateSelect }: PeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { cycles, getPredictedPeriods, getFertilityWindows, userPreferences } = usePeriodTracking();
  
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
  
  // Get more predicted periods (6 months) for better calendar visibility
  const predictions = getPredictedPeriods(6);
  const fertilityWindows = getFertilityWindows(6);

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
        return periodDay.flowIntensity || null;
      }
    }
    
    return null;
  };

  // Get emoji based on day type
  const getDayEmoji = (date: Date): string | null => {
    if (isOvulationDay(date)) return "✨";
    if (isPeriodDay(date)) return "💧";
    if (isFertileDay(date)) return "💫";
    if (isPredictedPeriodDay(date)) return "📅";
    return null;
  };

  const getDayTooltip = (date: Date): string => {
    const dayType = [];
    
    if (isPeriodDay(date)) {
      const flow = getDayFlowIntensity(date);
      dayType.push(`Period day (${flow} flow)`);
    }
    
    if (isPredictedPeriodDay(date) && !isPeriodDay(date)) {
      dayType.push("Predicted period");
    }
    
    if (isFertileDay(date)) {
      dayType.push("Fertile window");
    }
    
    if (isOvulationDay(date)) {
      dayType.push("Ovulation day");
    }
    
    if (isSameDay(date, new Date())) {
      dayType.push("Today");
    }
    
    return dayType.length ? dayType.join(" • ") : format(date, "MMMM d, yyyy");
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  }, [onDateSelect]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevMonth}
          className="rounded-full hover:bg-primary/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-poppins font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="rounded-full hover:bg-primary/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
          <div key={day} className="text-xs font-medium text-muted-foreground py-2 font-poppins">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        <TooltipProvider delayDuration={300}>
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map(day => {
                const isPeriod = isPeriodDay(day);
                const isPrediction = !isPeriod && isPredictedPeriodDay(day);
                const isFertile = !isPeriod && !isPrediction && isFertileDay(day);
                const isOvulation = !isPeriod && !isPrediction && isOvulationDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const flowIntensity = getDayFlowIntensity(day);
                const emoji = getDayEmoji(day);
                const tooltipText = getDayTooltip(day);
                
                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center relative p-1 transition-all duration-200",
                          isPeriod && "bg-primary text-primary-foreground font-medium rounded-full shadow-sm",
                          isPrediction && "border-2 border-primary/70 text-primary-foreground rounded-full",
                          isFertile && "border-2 border-blue-400/70 text-blue-500 rounded-full",
                          isOvulation && "border-2 border-blue-500 text-blue-600 rounded-full font-medium",
                          isToday && !isPeriod && !isPrediction && !isFertile && !isOvulation && "bg-primary/20 rounded-full font-medium",
                          !isCurrentMonth && "text-muted-foreground/50",
                          isSelected && "ring-2 ring-offset-2 ring-primary shadow-lg",
                          "hover:scale-110 hover:z-10 cursor-pointer"
                        )}
                        onClick={() => handleDateSelect(day)}
                      >
                        <span className="text-sm">{format(day, "d")}</span>
                        {emoji && <span className="text-xs mt-0.5">{emoji}</span>}
                        
                        {/* Flow indicator dot with improved visibility */}
                        {flowIntensity && (
                          <div 
                            className={cn(
                              "absolute -bottom-1 w-2.5 h-2.5 rounded-full mx-auto shadow-sm",
                              flowIntensity === "light" && "bg-pink-300",
                              flowIntensity === "medium" && "bg-pink-500",
                              flowIntensity === "heavy" && "bg-pink-700"
                            )}
                          />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-inter text-xs">
                      {tooltipText}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </React.Fragment>
          ))}
        </TooltipProvider>
      </div>

      <div className="mt-6 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
            <span className="text-xs">Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-primary/70 rounded-full"></div>
            <span className="text-xs">Predicted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-blue-400/70 rounded-full"></div>
            <span className="text-xs">Fertile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-blue-500 rounded-full"></div>
            <span className="text-xs">Ovulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-primary/20 rounded-full"></div>
            <span className="text-xs">Today</span>
          </div>
        </div>
      </div>

      {/* Flow intensity legend with improved styling */}
      <div className="mt-4 border-t border-primary/10 pt-3">
        <p className="text-xs text-center mb-2 flex items-center justify-center gap-1">
          <Droplets className="h-3 w-3 text-primary" />
          <span className="font-medium">Flow Intensity</span>
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-pink-300 rounded-full shadow-sm"></div>
            <span className="text-xs">Light</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-pink-500 rounded-full shadow-sm"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-pink-700 rounded-full shadow-sm"></div>
            <span className="text-xs">Heavy</span>
          </div>
        </div>
      </div>

      {/* Preferences info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">
          Cycle length: {userPreferences.averageCycleLength} days • Period length: {userPreferences.averagePeriodLength} days
        </p>
      </div>
    </div>
  );
}
