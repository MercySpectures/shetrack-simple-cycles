
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { usePeriodTracking } from "@/lib/period-context";
import { CalendarIcon, HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function OnboardingModal() {
  const { updateUserPreferences } = usePeriodTracking();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(undefined);
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const handleComplete = () => {
    // Save preferences
    updateUserPreferences({
      averageCycleLength: parseInt(cycleLength, 10),
      averagePeriodLength: parseInt(periodLength, 10),
      lastUpdated: new Date().toISOString(),
      isOnboardingComplete: true
    });

    // Show success message
    toast({
      title: "Setup complete!",
      description: "Your preferences have been saved. You can change them anytime in settings."
    });

    // Close the modal
    setIsOpen(false);
  };

  const handleNext = () => {
    if (step === 1 && !lastPeriodDate) {
      toast({
        title: "Date required",
        description: "Please select your last period start date to continue.",
        variant: "destructive"
      });
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isValidInput = (value: string, min: number, max: number) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= min && num <= max;
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex flex-col items-center mb-2">
            <div className="relative mb-2">
              <div className="absolute -top-1.5 -left-1.5 w-10 h-10 bg-pink-200 rounded-full animate-pulse opacity-50" />
              <HeartPulse className="h-8 w-8 text-primary-foreground relative z-10" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
              Welcome to SheTrack
            </DialogTitle>
          </div>
          <DialogDescription className="text-center">
            Let's set up your personal cycle tracking to get more accurate predictions
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-center text-sm">When did your last period start?</p>
            
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full max-w-xs justify-start text-left font-normal",
                      !lastPeriodDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPeriodDate ? format(lastPeriodDate, "MMMM d, yyyy") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="center">
                  <Calendar
                    mode="single"
                    selected={lastPeriodDate}
                    onSelect={setLastPeriodDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <p className="text-center text-xs text-muted-foreground">
              This helps us calculate your cycle more accurately
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-center text-sm mb-4">How long is your typical menstrual cycle?</p>
            
            <div className="flex justify-center">
              <Card className="max-w-xs w-full">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cycle-length">Cycle Length (days):</Label>
                      <Input
                        id="cycle-length"
                        value={cycleLength}
                        onChange={(e) => handleNumberInput(e, setCycleLength, 21, 40)}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Most cycles range from 21-40 days. This is counted from the first day of one period 
                      to the first day of the next.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-center text-sm mb-4">How many days does your period typically last?</p>
            
            <div className="flex justify-center">
              <Card className="max-w-xs w-full">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="period-length">Period Length (days):</Label>
                      <Input
                        id="period-length"
                        value={periodLength}
                        onChange={(e) => handleNumberInput(e, setPeriodLength, 1, 10)}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Most periods last 2-7 days. This is counted from the first day of bleeding to the last.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <div></div> // Empty div to maintain spacing with flex justify-between
          )}
          <Button onClick={handleNext}>{step < 3 ? "Next" : "Complete"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
