
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { CalendarDays, Droplets, Egg, BarChart3 } from "lucide-react";
import { usePeriodTracking } from "@/lib/period-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CycleStats() {
  const { 
    cycles, 
    getAverageCycleLength, 
    getAveragePeriodLength, 
    getPredictedPeriods,
    getFertilityWindows,
    getCurrentCycleDayInfo
  } = usePeriodTracking();
  
  // Get next period prediction
  const predictions = getPredictedPeriods(1);
  const nextPeriod = predictions.length > 0 ? predictions[0] : null;
  
  // Get fertility window information
  const fertilityWindows = getFertilityWindows(1);
  const nextFertilityWindow = fertilityWindows.length > 0 ? fertilityWindows[0] : null;
  
  // Calculate days until next period
  const daysUntil = nextPeriod ? 
    differenceInDays(parseISO(nextPeriod.startDate), new Date()) : 
    null;

  // Get current cycle day info
  const cycleDayInfo = getCurrentCycleDayInfo();
  
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
              <CalendarDays className="h-5 w-5 text-primary" />
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
      
      {/* Cycle Day Progress */}
      {cycleDayInfo.currentDay !== null && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Current Cycle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p>Day {cycleDayInfo.currentDay} of {cycleDayInfo.totalDays}</p>
                <p className="text-muted-foreground text-sm">
                  {Math.round((cycleDayInfo.currentDay / cycleDayInfo.totalDays) * 100)}%
                </p>
              </div>
              <Progress 
                value={(cycleDayInfo.currentDay / cycleDayInfo.totalDays) * 100} 
                className="h-2" 
              />
              
              <div className="flex flex-wrap gap-2 mt-2">
                {cycleDayInfo.isPeriodDay && (
                  <Badge variant="secondary" className="bg-primary/20">
                    <Droplets className="h-3 w-3 mr-1" />
                    Period
                  </Badge>
                )}
                {cycleDayInfo.isFertileDay && (
                  <Badge variant="outline" className="border-blue-400/70 text-blue-500">
                    Fertile
                  </Badge>
                )}
                {cycleDayInfo.isOvulationDay && (
                  <Badge variant="outline" className="border-blue-500 text-blue-600">
                    <Egg className="h-3 w-3 mr-1" />
                    Ovulation
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Fertility Window */}
      {nextFertilityWindow && (
        <Card className="border-blue-200/30">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2">
              <Egg className="h-5 w-5 text-blue-500" />
              Fertility Window
            </CardTitle>
            <CardDescription>
              Predicted fertile days
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Fertile days</p>
                <p className="text-lg font-semibold">
                  {format(parseISO(nextFertilityWindow.fertileStart), "MMM d")} - {format(parseISO(nextFertilityWindow.fertileEnd), "MMM d")}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Ovulation on</p>
              <p className="text-lg font-semibold">
                {format(parseISO(nextFertilityWindow.ovulationDate), "MMMM d")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
