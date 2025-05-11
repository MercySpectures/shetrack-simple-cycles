
import { CycleStats } from "@/components/CycleStats";
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";
import { PeriodNotes } from "@/components/PeriodNotes";
import { Reminders } from "@/components/Reminders";
import { OnboardingModal } from "@/components/OnboardingModal";
import { usePeriodTracking } from "@/lib/period-context";
import { CalendarDays, BarChart3, HeartPulse, BellRing } from "lucide-react";

const HomePage = () => {
  const { userPreferences } = usePeriodTracking();
  const showOnboarding = !userPreferences.isOnboardingComplete;

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      {showOnboarding && <OnboardingModal />}
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 font-poppins flex items-center justify-center">
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 w-10 h-10 bg-pink-200 rounded-full animate-pulse opacity-50" />
            <HeartPulse className="h-8 w-8 text-primary-foreground relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent ml-2">
            SheTrack
          </span>
        </h1>
        <p className="text-muted-foreground">Simple period tracking, just for you ✨</p>
      </div>
      
      <div className="space-y-8">
        <CycleStats />
        
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            <CalendarDays className="h-5 w-5 text-primary" />
            This Month
          </h2>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl">
            <PeriodCalendar />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PeriodNotes />
          <Reminders />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            <BarChart3 className="h-5 w-5 text-primary" />
            Cycle Analysis
          </h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <CycleChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
