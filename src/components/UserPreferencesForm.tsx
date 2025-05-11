
import { useState } from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    });
    
    toast({
      title: "Preferences updated",
      description: "Your cycle preferences have been saved successfully."
    });
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
            <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
            <Input
              id="cycle-length"
              type="number"
              min="21"
              max="40"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="border-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Most cycles range from 21-40 days. This is counted from the first day of one period to the first day of the next.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="period-length">Average Period Length (days)</Label>
            <Input
              id="period-length"
              type="number"
              min="1"
              max="10"
              value={periodLength}
              onChange={(e) => setPeriodLength(e.target.value)}
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
