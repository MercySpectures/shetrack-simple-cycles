
import { createContext, useContext, useEffect, useState } from "react";
import { addDays, differenceInDays, format, parseISO, isBefore, isAfter, isWithinInterval } from "date-fns";
import { 
  FlowIntensity, 
  PeriodDay, 
  PeriodCycle, 
  FertilityWindow, 
  Reminder,
  UserPreferences 
} from "@/lib/types";

interface PeriodContextType {
  cycles: PeriodCycle[];
  reminders: Reminder[];
  userPreferences: UserPreferences;
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
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  addNoteToDay: (date: string, note: string) => void;
  addNoteToCycle: (cycleId: string, note: string) => void;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastUpdated: new Date().toISOString(),
};

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [cycles, setCycles] = useState<PeriodCycle[]>(() => {
    const savedCycles = localStorage.getItem("shetrack-cycles");
    return savedCycles ? JSON.parse(savedCycles) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const savedReminders = localStorage.getItem("shetrack-reminders");
    return savedReminders ? JSON.parse(savedReminders) : [];
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem("shetrack-preferences");
    return savedPreferences ? JSON.parse(savedPreferences) : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    localStorage.setItem("shetrack-cycles", JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem("shetrack-reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("shetrack-preferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

  const addCycle = (startDate: string, endDate: string, days: PeriodDay[]) => {
    const newCycle: PeriodCycle = {
      id: Date.now().toString(),
      startDate,
      endDate,
      days,
      periodLength: differenceInDays(new Date(endDate), new Date(startDate)) + 1
    };
    
    setCycles(prevCycles => {
      const updatedCycles = [...prevCycles, newCycle].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      // Calculate cycle lengths for adjacent periods
      if (updatedCycles.length > 1) {
        return updatedCycles.map((cycle, index) => {
          if (index === 0) return cycle;
          
          const prevCycle = updatedCycles[index - 1];
          const cycleLength = differenceInDays(
            new Date(cycle.startDate),
            new Date(prevCycle.startDate)
          );
          
          return { ...cycle, cycleLength };
        });
      }
      
      return updatedCycles;
    });
  };

  const updateCycle = (updatedCycle: PeriodCycle) => {
    setCycles(prevCycles => {
      const updatedCycles = prevCycles.map(cycle => 
        cycle.id === updatedCycle.id ? updatedCycle : cycle
      );

      // Recalculate cycle lengths after update
      return updatedCycles.map((cycle, index) => {
        if (index === 0) return cycle;
        
        const prevCycle = updatedCycles[index - 1];
        const cycleLength = differenceInDays(
          new Date(cycle.startDate),
          new Date(prevCycle.startDate)
        );
        
        return { ...cycle, cycleLength };
      });
    });
  };

  const deleteCycle = (id: string) => {
    setCycles(prevCycles => {
      const filteredCycles = prevCycles.filter(cycle => cycle.id !== id);

      // Recalculate cycle lengths after deletion
      return filteredCycles.map((cycle, index) => {
        if (index === 0) return cycle;
        
        const prevCycle = filteredCycles[index - 1];
        const cycleLength = differenceInDays(
          new Date(cycle.startDate),
          new Date(prevCycle.startDate)
        );
        
        return { ...cycle, cycleLength };
      });
    });
  };

  const getAverageCycleLength = () => {
    if (userPreferences.averageCycleLength) return userPreferences.averageCycleLength;
    
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
    if (userPreferences.averagePeriodLength) return userPreferences.averagePeriodLength;
    
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
    
    const avgCycleLength = userPreferences.averageCycleLength || getAverageCycleLength();
    const avgPeriodLength = userPreferences.averagePeriodLength || getAveragePeriodLength();
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
    
    const avgCycleLength = userPreferences.averageCycleLength || getAverageCycleLength();
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

  // Reminder functions
  const addReminder = (reminder: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (updatedReminder: Reminder) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === updatedReminder.id ? updatedReminder : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  // User preferences functions
  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...preferences,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Notes functions
  const addNoteToDay = (date: string, note: string) => {
    setCycles(prevCycles => {
      return prevCycles.map(cycle => {
        const updatedDays = cycle.days.map(day => 
          day.date === date ? { ...day, notes: note } : day
        );
        
        return {
          ...cycle,
          days: updatedDays
        };
      });
    });
  };

  const addNoteToCycle = (cycleId: string, note: string) => {
    setCycles(prevCycles => {
      return prevCycles.map(cycle => 
        cycle.id === cycleId ? { ...cycle, notes: note } : cycle
      );
    });
  };

  return (
    <PeriodContext.Provider
      value={{
        cycles,
        reminders,
        userPreferences,
        addCycle,
        updateCycle,
        deleteCycle,
        getAverageCycleLength,
        getAveragePeriodLength,
        getPredictedPeriods,
        getFertilityWindows,
        getCurrentCycleDayInfo,
        addReminder,
        updateReminder,
        deleteReminder,
        updateUserPreferences,
        addNoteToDay,
        addNoteToCycle
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
