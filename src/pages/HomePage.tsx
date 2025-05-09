
import { CycleStats } from "@/components/CycleStats";
import { PeriodCalendar } from "@/components/PeriodCalendar";

const HomePage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">SheTrack</h1>
        <p className="text-muted-foreground">Simple period tracking, just for you</p>
      </div>
      
      <div className="space-y-8">
        <CycleStats />
        <div>
          <h2 className="text-xl font-semibold mb-4">This Month</h2>
          <PeriodCalendar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
