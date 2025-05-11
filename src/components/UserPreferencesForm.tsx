
import { useState } from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export function UserPreferencesForm() {
  const { userPreferences, updateUserPreferences } = usePeriodTracking();
  const { toast } = useToast();
  
  const [cycleLength, setCycleLength] = useState(userPreferences.averageCycleLength.toString());
  const [periodLength, setPeriodLength] = useState(userPreferences.averagePeriodLength.toString());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cycleLengthNum = parseInt(cycleLength, 10);
    const periodLengthNum = parseInt(periodLength, 10);
    
    if (isNaN(cycleLengthNum) || cycleLengthNum < 21 || cycleLengthNum > 40) {
      toast({
        title: "Invalid cycle length",
        description: "Please enter a cycle length between 21-40 days.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(periodLengthNum) || periodLengthNum < 1 || periodLengthNum > 10) {
      toast({
        title: "Invalid period length",
        description: "Please enter a period length between 1-10 days.",
        variant: "destructive"
      });
      return;
    }
    
    updateUserPreferences({
      averageCycleLength: cycleLengthNum,
      averagePeriodLength: periodLengthNum,
      isOnboardingComplete: true
    });
    
    toast({
      title: "Preferences updated",
      description: "Your cycle preferences have been saved successfully."
    });
  };

  // Prevent input of non-numeric characters
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    min: number,
    max: number
  ) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value === "") {
      setter("");
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      if (num < min) setter(min.toString());
      else if (num > max) setter(max.toString());
      else setter(value);
    }
  };
  
  return (
    <Card className="border-primary/20 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <CardTitle className="font-medium">Cycle Preferences</CardTitle>
        </div>
        <CardDescription>
          Customize your cycle predictions for more accurate tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-72 text-xs">
                    <p>This is the number of days from the first day of one period to the first day of the next.</p>
                    <p className="mt-1">The average menstrual cycle is 28 days, but cycles can range from 21 to 40 days.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="cycle-length"
              type="text"
              inputMode="numeric"
              min="21"
              max="40"
              value={cycleLength}
              onChange={(e) => handleNumberInput(e, setCycleLength, 21, 40)}
              className="border-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Most cycles range from 21-40 days. This is counted from the first day of one period to the first day of the next.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="period-length">Average Period Length (days)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-72 text-xs">
                    <p>This is the number of days your period typically lasts.</p>
                    <p className="mt-1">Most periods last between 3-7 days, but can be shorter or longer.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="period-length"
              type="text"
              inputMode="numeric"
              min="1"
              max="10"
              value={periodLength}
              onChange={(e) => handleNumberInput(e, setPeriodLength, 1, 10)}
              className="border-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Most periods last 3-7 days. This is counted from the first day of bleeding to the last.
            </p>
          </div>
          
          <Button type="submit" className="w-full">
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
