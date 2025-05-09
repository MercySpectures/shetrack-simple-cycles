
import { createContext, useContext, useEffect, useState } from "react";
import { addDays, differenceInDays, format, parseISO } from "date-fns";

// Types
export type FlowIntensity = "light" | "medium" | "heavy";

export interface PeriodDay {
  date: string;
  flow: FlowIntensity;
}

export interface PeriodCycle {
  id: string;
  startDate: string;
  endDate: string;
  days: PeriodDay[];
}

interface PeriodContextType {
  cycles: PeriodCycle[];
  addCycle: (startDate: string, endDate: string, days: PeriodDay[]) => void;
  updateCycle: (cycle: PeriodCycle) => void;
  deleteCycle: (id: string) => void;
  getAverageCycleLength: () => number;
  getAveragePeriodLength: () => number;
  getPredictedPeriods: (months: number) => { startDate: string; endDate: string }[];
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

  return (
    <PeriodContext.Provider
      value={{
        cycles,
        addCycle,
        updateCycle,
        deleteCycle,
        getAverageCycleLength,
        getAveragePeriodLength,
        getPredictedPeriods
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
