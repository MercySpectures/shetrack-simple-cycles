
import { CycleStats } from "@/components/CycleStats";
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";
import { CalendarDays, BarChart3 } from "lucide-react";

const HomePage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 font-poppins bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
          SheTrack
        </h1>
        <p className="text-muted-foreground">Simple period tracking, just for you ✨</p>
      </div>
      
      <div className="space-y-8">
        <CycleStats />
        
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-primary rounded-full mr-1"></span>
            <CalendarDays className="h-5 w-5 text-primary" />
            This Month
          </h2>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl">
            <PeriodCalendar />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-primary rounded-full mr-1"></span>
            <BarChart3 className="h-5 w-5 text-primary" />
            Cycle Analysis
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/10">
            <CycleChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
