
import { useState, useEffect } from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Pencil, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PeriodNotes({ date }: { date?: Date }) {
  const { cycles, addNoteToDay } = usePeriodTracking();
  const { toast } = useToast();
  
  const selectedDate = date || new Date();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  
  // Find note for this day if it exists
  const findDayNote = () => {
    for (const cycle of cycles) {
      const day = cycle.days.find(d => d.date === dateStr);
      if (day?.notes) return day.notes;
    }
    return "";
  };
  
  const [note, setNote] = useState(findDayNote());
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setNote(findDayNote());
    setIsEditing(false);
  }, [dateStr]);
  
  const handleSave = () => {
    addNoteToDay(dateStr, note);
    setIsEditing(false);
    
    toast({
      title: "Note saved",
      description: `Your note for ${format(selectedDate, "MMMM d, yyyy")} has been saved.`
    });
  };
  
  return (
    <Card className="border-primary/20 overflow-hidden shadow-sm">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle className="font-medium">Notes</CardTitle>
          </div>
          <span className="text-sm font-medium">
            {format(selectedDate, "MMMM d, yyyy")}
          </span>
        </div>
        <CardDescription>
          Track symptoms, mood, or anything else about your day
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your notes here..."
              className="min-h-[120px] border-primary/20 resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                className="flex items-center gap-1" 
                onClick={handleSave}
              >
                <Save className="h-4 w-4" /> 
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[120px]">
            <div className="flex justify-end mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center gap-1 h-7"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <ScrollArea className="h-[100px]">
              {note ? (
                <p className="whitespace-pre-wrap text-sm">{note}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No notes for this day yet. Click edit to add notes.
                </p>
              )}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
