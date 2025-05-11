
import { useState } from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format, parseISO, isBefore } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Bell, CalendarPlus, Check, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Reminders() {
  const { reminders, addReminder, updateReminder, deleteReminder } = usePeriodTracking();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleAddReminder = () => {
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a title for your reminder.",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Missing date",
        description: "Please select a date for your reminder.",
        variant: "destructive"
      });
      return;
    }
    
    addReminder({
      title: title.trim(),
      description: description.trim(),
      date: format(date, "yyyy-MM-dd"),
      completed: false
    });
    
    toast({
      title: "Reminder added",
      description: "Your reminder has been added successfully."
    });
    
    // Reset form
    setIsAdding(false);
    setTitle("");
    setDescription("");
    setDate(new Date());
  };
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      updateReminder({
        ...reminder,
        completed
      });
    }
  };
  
  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    toast({
      title: "Reminder deleted",
      description: "Your reminder has been deleted successfully."
    });
  };
  
  // Sort reminders: incomplete first, then by date
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  return (
    <Card className="border-primary/20 overflow-hidden shadow-sm h-full">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="font-medium text-sm sm:text-base">Reminders</CardTitle>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1 hover:bg-primary/20"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancel" : <><Plus className="h-3 w-3 sm:h-4 sm:w-4" /> Add</>}
          </Button>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Set reminders for appointments or important cycle events
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {isAdding && (
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-muted/30 rounded-lg">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="reminder-title" className="text-xs sm:text-sm">Title</Label>
              <Input
                id="reminder-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Appointment, medication, etc."
                className="border-primary/20 h-8 sm:h-9 text-xs sm:text-sm"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="reminder-date" className="text-xs sm:text-sm">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-primary/20 h-8 sm:h-9 text-xs sm:text-sm",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="reminder-desc" className="text-xs sm:text-sm">Notes (optional)</Label>
              <Textarea
                id="reminder-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details..."
                className="resize-none border-primary/20 h-16 sm:h-20 text-xs sm:text-sm"
              />
            </div>
            
            <Button 
              className="w-full flex items-center gap-1 h-8 sm:h-9 text-xs sm:text-sm" 
              size="sm"
              onClick={handleAddReminder}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> Add Reminder
            </Button>
          </div>
        )}
        
        {sortedReminders.length > 0 ? (
          <ScrollArea className="h-[180px] sm:h-[250px] pr-2 sm:pr-4">
            <div className="space-y-2 sm:space-y-3">
              {sortedReminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={cn(
                    "flex items-start space-x-2 p-2 sm:p-3 rounded-lg border", 
                    reminder.completed 
                      ? "border-muted bg-muted/30 text-muted-foreground" 
                      : "border-primary/20 bg-primary/5"
                  )}
                >
                  <Checkbox
                    checked={reminder.completed}
                    onCheckedChange={(checked) => 
                      handleToggleComplete(reminder.id, checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className={cn(
                        "font-medium text-xs sm:text-sm", 
                        reminder.completed && "line-through"
                      )}>
                        {reminder.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <Trash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </Button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      {format(parseISO(reminder.date), "MMMM d, yyyy")}
                    </p>
                    {reminder.description && (
                      <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 whitespace-pre-wrap">
                        {reminder.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[100px] text-center">
            <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50 mb-1 sm:mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              No reminders yet. Click the add button to create one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
