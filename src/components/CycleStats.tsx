
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { usePeriodTracking } from "@/lib/period-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CycleStats() {
  const { cycles, getAverageCycleLength, getAveragePeriodLength, getPredictedPeriods } = usePeriodTracking();
  
  // Get next period prediction
  const predictions = getPredictedPeriods(1);
  const nextPeriod = predictions.length > 0 ? predictions[0] : null;
  
  // Calculate days until next period
  const daysUntil = nextPeriod ? 
    differenceInDays(parseISO(nextPeriod.startDate), new Date()) : 
    null;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cycle Overview</CardTitle>
          <CardDescription>Your period statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Cycle Length</p>
              <p className="text-2xl font-bold">{getAverageCycleLength()} days</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Period Length</p>
              <p className="text-2xl font-bold">{getAveragePeriodLength()} days</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Periods Tracked</p>
              <p className="text-2xl font-bold">{cycles.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Period</p>
              <p className="text-2xl font-bold">
                {cycles.length > 0
                  ? format(parseISO(cycles[cycles.length - 1].startDate), "MMM d")
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {nextPeriod && (
        <Card className="relative overflow-hidden border-primary/20">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary-foreground" />
              Next Period
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Expected on</p>
                <p className="text-xl font-bold">
                  {format(parseISO(nextPeriod.startDate), "MMMM d")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Days until</p>
                <p className="text-xl font-bold">{daysUntil}</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-2xl"></div>
        </Card>
      )}
    </div>
  );
}
