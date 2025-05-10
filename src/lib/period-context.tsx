
import { createContext, useContext, useEffect, useState } from "react";
import { addDays, differenceInDays, format, parseISO, isBefore, isAfter, isWithinInterval } from "date-fns";

// Types
export type FlowIntensity = "light" | "medium" | "heavy";

export interface PeriodDay {
  date: string;
  flow: FlowIntensity;
  symptoms?: string[];
  mood?: "happy" | "neutral" | "sad";
}

export interface PeriodCycle {
  id: string;
  startDate: string;
  endDate: string;
  days: PeriodDay[];
}

export interface FertilityWindow {
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
}

interface PeriodContextType {
  cycles: PeriodCycle[];
  addCycle: (startDate: string, endDate: string, days: PeriodDay[]) => void;
  updateCycle: (cycle: PeriodCycle) => void;
  deleteCycle: (id: string) => void;
  getAverageCycleLength: () => number;
  getAveragePeriodLength: () => number;
  getPredictedPeriods: (months: number) => { startDate: string; endDate: string }[];
  getFertilityWindows: (months: number) => FertilityWindow[];
  getCurrentCycleDayInfo: () => { 
    currentDay: number | null; 
    totalDays: number;
    isPeriodDay: boolean;
    isFertileDay: boolean;
    isOvulationDay: boolean;
  };
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [cycles, setCycles] = useState<PeriodCycle[]>(() => {
    const savedCycles = localStorage.getItem("shetrack-cycles");
    return savedCycles ? JSON.parse(savedCycles) : [];
  });

  useEffect(() => {
    localStorage.setItem("shetrack-cycles", JSON.stringify(cycles));
  }, [cycles]);

  const addCycle = (startDate: string, endDate: string, days: PeriodDay[]) => {
    const newCycle: PeriodCycle = {
      id: Date.now().toString(),
      startDate,
      endDate,
      days,
    };
    
    setCycles(prevCycles => [...prevCycles, newCycle].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ));
  };

  const updateCycle = (updatedCycle: PeriodCycle) => {
    setCycles(prevCycles => 
      prevCycles.map(cycle => 
        cycle.id === updatedCycle.id ? updatedCycle : cycle
      )
    );
  };

  const deleteCycle = (id: string) => {
    setCycles(prevCycles => prevCycles.filter(cycle => cycle.id !== id));
  };

  const getAverageCycleLength = () => {
    if (cycles.length < 2) return 28; // Default cycle length
    
    let totalLength = 0;
    let count = 0;
    
    for (let i = 1; i < cycles.length; i++) {
      const current = parseISO(cycles[i].startDate);
      const previous = parseISO(cycles[i-1].startDate);
      const diff = differenceInDays(current, previous);
      
      if (diff > 0 && diff < 60) { // Filter out outliers
        totalLength += diff;
        count++;
      }
    }
    
    return count > 0 ? Math.round(totalLength / count) : 28;
  };

  const getAveragePeriodLength = () => {
    if (cycles.length === 0) return 5; // Default period length
    
    let totalLength = 0;
    
    for (const cycle of cycles) {
      const start = parseISO(cycle.startDate);
      const end = parseISO(cycle.endDate);
      const diff = differenceInDays(end, start) + 1;
      
      if (diff > 0 && diff < 15) { // Filter out outliers
        totalLength += diff;
      }
    }
    
    return cycles.length > 0 ? Math.round(totalLength / cycles.length) : 5;
  };

  const getPredictedPeriods = (months = 3) => {
    if (cycles.length === 0) return [];
    
    const avgCycleLength = getAverageCycleLength();
    const avgPeriodLength = getAveragePeriodLength();
    const predictions = [];
    
    // Start prediction from last period
    let lastPeriodStart = parseISO(cycles[cycles.length - 1].startDate);
    
    for (let i = 0; i < months; i++) {
      lastPeriodStart = addDays(lastPeriodStart, avgCycleLength);
      const periodEnd = addDays(lastPeriodStart, avgPeriodLength - 1);
      
      predictions.push({
        startDate: format(lastPeriodStart, "yyyy-MM-dd"),
        endDate: format(periodEnd, "yyyy-MM-dd")
      });
    }
    
    return predictions;
  };

  const getFertilityWindows = (months = 3) => {
    if (cycles.length === 0) return [];
    
    const avgCycleLength = getAverageCycleLength();
    const windows: FertilityWindow[] = [];
    
    // Start from the last period
    let lastPeriodStart = parseISO(cycles[cycles.length - 1].startDate);
    
    // Calculate for the current cycle first
    // Ovulation typically happens 14 days before the next period
    const nextPeriodStart = addDays(lastPeriodStart, avgCycleLength);
    const ovulationDate = addDays(nextPeriodStart, -14);
    
    // Fertility window is typically 5 days before ovulation and the day of ovulation
    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = ovulationDate;
    
    // If fertile window is in the future, add it
    if (isAfter(fertileEnd, new Date())) {
      windows.push({
        ovulationDate: format(ovulationDate, "yyyy-MM-dd"),
        fertileStart: format(fertileStart, "yyyy-MM-dd"),
        fertileEnd: format(fertileEnd, "yyyy-MM-dd")
      });
    }
    
    // Calculate for future cycles
    let futurePeriodStart = nextPeriodStart;
    
    for (let i = 0; i < months; i++) {
      // Next period
      futurePeriodStart = addDays(futurePeriodStart, avgCycleLength);
      
      // Calculate ovulation and fertile window
      const futureOvulationDate = addDays(futurePeriodStart, -14);
      const futureFertileStart = addDays(futureOvulationDate, -5);
      const futureFertileEnd = futureOvulationDate;
      
      windows.push({
        ovulationDate: format(futureOvulationDate, "yyyy-MM-dd"),
        fertileStart: format(futureFertileStart, "yyyy-MM-dd"),
        fertileEnd: format(futureFertileEnd, "yyyy-MM-dd")
      });
    }
    
    return windows;
  };

  const getCurrentCycleDayInfo = () => {
    // Initialize with default values
    const defaultInfo = { 
      currentDay: null, 
      totalDays: getAverageCycleLength(),
      isPeriodDay: false,
      isFertileDay: false,
      isOvulationDay: false
    };
    
    if (cycles.length === 0) {
      return defaultInfo;
    }
    
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    const lastCycle = cycles[cycles.length - 1];
    const lastCycleStart = parseISO(lastCycle.startDate);
    
    // Check if currently in period
    const isPeriodDay = lastCycle.days.some(day => day.date === todayStr);
    
    // Calculate current day in cycle
    const daysSinceStart = differenceInDays(today, lastCycleStart);
    
    // Get fertility windows
    const fertilityWindows = getFertilityWindows(1);
    const currentFertilityWindow = fertilityWindows[0];
    
    // Check if today is in the fertile window or ovulation day
    let isFertileDay = false;
    let isOvulationDay = false;
    
    if (currentFertilityWindow) {
      isOvulationDay = todayStr === currentFertilityWindow.ovulationDate;
      
      if (!isOvulationDay) {
        const fertileStart = parseISO(currentFertilityWindow.fertileStart);
        const fertileEnd = parseISO(currentFertilityWindow.fertileEnd);
        
        isFertileDay = isWithinInterval(today, {
          start: fertileStart,
          end: fertileEnd
        });
      }
    }
    
    return {
      currentDay: daysSinceStart >= 0 ? daysSinceStart + 1 : null,
      totalDays: getAverageCycleLength(),
      isPeriodDay,
      isFertileDay,
      isOvulationDay
    };
  };

  return (
    <PeriodContext.Provider
      value={{
        cycles,
        addCycle,
        updateCycle,
        deleteCycle,
        getAverageCycleLength,
        getAveragePeriodLength,
        getPredictedPeriods,
        getFertilityWindows,
        getCurrentCycleDayInfo
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriodTracking() {
  const context = useContext(PeriodContext);
  
  if (!context) {
    throw new Error("usePeriodTracking must be used within a PeriodProvider");
  }
  
  return context;
}
