
export type FlowIntensity = "light" | "medium" | "heavy";

export interface PeriodDay {
  date: string;
  flow: FlowIntensity;
  symptoms?: string[];
  mood?: "happy" | "neutral" | "sad";
  notes?: string;
}

export interface PeriodCycle {
  id: string;
  startDate: string;
  endDate: string;
  days: PeriodDay[];
  cycleLength?: number;
  periodLength?: number;
  notes?: string;
}

export interface FertilityWindow {
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
}

export interface Reminder {
  id: string;
  date: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface UserPreferences {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastUpdated: string;
}
