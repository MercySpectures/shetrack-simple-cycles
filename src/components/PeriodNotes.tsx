
import { useState, useEffect } from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Pencil, Save, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PeriodNotes({ date }: { date?: Date }) {
  const { cycles, addNoteToDay } = usePeriodTracking();
  const { toast } = useToast();
  
  const selectedDate = date || new Date();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  
  // Find notes for this day if they exist
  const findDayNotes = () => {
    for (const cycle of cycles) {
      const day = cycle.days.find(d => d.date === dateStr);
      if (day?.notes) {
        // Handle both string and string[] types
        return Array.isArray(day.notes) ? day.notes : [day.notes];
      }
    }
    return [];
  };
  
  const [notes, setNotes] = useState<string[]>(findDayNotes());
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    setNotes(findDayNotes());
    setIsAdding(false);
    setNewNote("");
  }, [dateStr]);
  
  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    
    const updatedNotes = [...notes, newNote.trim()];
    addNoteToDay(dateStr, updatedNotes);
    setNotes(updatedNotes);
    setNewNote("");
    setIsAdding(false);
    
    toast({
      title: "Note saved",
      description: `Your note for ${format(selectedDate, "MMMM d, yyyy")} has been saved.`
    });
  };
  
  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    addNoteToDay(dateStr, updatedNotes);
    setNotes(updatedNotes);
    
    toast({
      title: "Note deleted",
      description: "Your note has been removed."
    });
  };

  return (
    <Card className="border-primary/20 overflow-hidden shadow-sm h-full">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="font-medium text-sm sm:text-base">Notes</CardTitle>
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
          Track symptoms, mood, or anything else about your day
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {isAdding && (
          <div className="space-y-3 mb-4 p-3 bg-muted/30 rounded-lg">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your notes here..."
              className="min-h-[100px] border-primary/20 resize-none text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button 
                className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9" 
                size="sm"
                onClick={handleSaveNote}
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4" /> 
                Save Note
              </Button>
            </div>
          </div>
        )}
        
        <ScrollArea className="h-[240px] pr-2">
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="note-item">
                  <div className="note-item-header">
                    <span className="text-xs text-muted-foreground">
                      {format(selectedDate, "MMMM d, yyyy")} - Note {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteNote(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="note-item-content">{note}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-center">
              <CalendarDays className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50 mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                No notes for this day yet. Click the add button to create one.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
