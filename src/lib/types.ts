
import { ReactNode } from "react";

export interface PeriodDay {
  id?: string;
  date: string;
  flowIntensity?: FlowIntensity;
  symptoms?: string[];
  mood?: string[];
  notes?: string[]; // Changed from string to string[] for multiple notes
}

export interface PeriodCycle {
  id: string;
  startDate: string;
  endDate: string;
  days: PeriodDay[];
  cycleLength?: number;
  periodLength: number;
  notes?: string[]; // Changed from string to string[] for multiple notes
}

export interface FertilityWindow {
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'period' | 'fertility' | 'medication' | 'other';
  isCompleted?: boolean;
}

export interface UserPreferences {
  userName: string; // Added userName field
  averageCycleLength: number;
  averagePeriodLength: number;
  lastUpdated: string;
  isOnboardingComplete?: boolean;
}

export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting' | null;

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}
