
import { useState, useEffect } from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format, addDays, parseISO, differenceInDays, isBefore, isSameDay, isAfter } from "date-fns";
import { Bell, BellRing, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CycleNotification } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function CycleNotifications() {
  const { cycles, userPreferences, calculateFertileWindow } = usePeriodTracking();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<CycleNotification[]>([]);
  
  useEffect(() => {
    if (cycles.length === 0) return;
    
    // Generate notifications based on cycle data
    const newNotifications: CycleNotification[] = [];
    const currentDate = new Date();
    const notificationTypes = ["period-start", "ovulation", "fertility-start", "fertility-end"];
    
    // Sort cycles by start date (newest first)
    const sortedCycles = [...cycles].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    
    // Use the most recent cycle for predictions
    const latestCycle = sortedCycles[0];
    if (!latestCycle) return;
    
    // Calculate the next expected period start date
    const nextPeriodStart = addDays(
      parseISO(latestCycle.startDate), 
      userPreferences.averageCycleLength
    );
    
    // Add notification for upcoming period
    if (differenceInDays(nextPeriodStart, currentDate) <= 5 && 
        isAfter(nextPeriodStart, currentDate)) {
      const daysUntil = differenceInDays(nextPeriodStart, currentDate);
      newNotifications.push({
        id: `period-${nextPeriodStart.toISOString()}`,
        type: "period-start",
        message: `Your next period is expected to start in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}.`,
        date: format(nextPeriodStart, "yyyy-MM-dd"),
        isRead: false
      });
    }
    
    // Calculate and add fertility window notifications
    try {
      const fertilityWindow = calculateFertileWindow(latestCycle);
      if (fertilityWindow) {
        const { ovulationDate, fertileStart, fertileEnd } = fertilityWindow;
        const ovulationDay = parseISO(ovulationDate);
        const fertileStartDay = parseISO(fertileStart);
        const fertileEndDay = parseISO(fertileEnd);
        
        // Ovulation notification
        if (differenceInDays(ovulationDay, currentDate) <= 2 && 
            differenceInDays(ovulationDay, currentDate) >= 0) {
          newNotifications.push({
            id: `ovulation-${ovulationDate}`,
            type: "ovulation",
            message: differenceInDays(ovulationDay, currentDate) === 0 
              ? "Today is your estimated ovulation day."
              : `Your estimated ovulation is in ${differenceInDays(ovulationDay, currentDate)} day${differenceInDays(ovulationDay, currentDate) !== 1 ? 's' : ''}.`,
            date: ovulationDate,
            isRead: false
          });
        }
        
        // Fertility window start notification
        if (differenceInDays(fertileStartDay, currentDate) <= 1 && 
            differenceInDays(fertileStartDay, currentDate) >= 0) {
          newNotifications.push({
            id: `fertility-start-${fertileStart}`,
            type: "fertility-start",
            message: differenceInDays(fertileStartDay, currentDate) === 0
              ? "Your fertile window begins today."
              : "Your fertile window begins tomorrow.",
            date: fertileStart,
            isRead: false
          });
        }
        
        // Current fertility window notification
        if (isAfter(currentDate, fertileStartDay) && 
            isBefore(currentDate, fertileEndDay)) {
          newNotifications.push({
            id: `fertility-current-${fertileStart}`,
            type: "fertility-start",
            message: "You are currently in your fertile window.",
            date: format(currentDate, "yyyy-MM-dd"),
            isRead: false
          });
        }
      }
    } catch (error) {
      console.error("Error calculating fertility window:", error);
    }
    
    setNotifications(newNotifications);
  }, [cycles, userPreferences]);
  
  const handleDismissAll = () => {
    setNotifications([]);
  };
  
  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'period-start':
        return 'bg-primary text-primary-foreground';
      case 'ovulation':
        return 'bg-secondary text-secondary-foreground';
      case 'fertility-start':
      case 'fertility-end':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 animate-fade-in">
      <Card className="border-primary/20 overflow-hidden shadow-sm">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="font-medium text-sm sm:text-base">Cycle Notifications</CardTitle>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs flex items-center gap-1"
              onClick={handleDismissAll}
            >
              Dismiss All
            </Button>
          </div>
          <CardDescription className="text-xs">
            Important updates about your cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 max-h-[300px] overflow-y-auto">
          {notifications.map((notif) => (
            <div key={notif.id} className="border-b last:border-b-0 p-3 relative">
              <div className="flex items-start gap-3">
                <Badge className={`${getNotificationColor(notif.type)} h-5 w-5 rounded-full p-0 flex items-center justify-center`}>
                  <Bell className="h-3 w-3" />
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(parseISO(notif.date), "MMMM d, yyyy")}
                  </p>
                </div>
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => handleDismiss(notif.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
