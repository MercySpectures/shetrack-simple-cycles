
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { usePeriodTracking } from "@/lib/period-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPreferencesForm } from "@/components/UserPreferencesForm";
import { Badge } from "@/components/ui/badge";
import { Settings, Download, Trash2, Heart, Calendar, HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { cycles, deleteCycle, getAverageCycleLength } = usePeriodTracking();
  const { toast } = useToast();
  const [showExportData, setShowExportData] = useState(false);
  
  const handleExportData = () => {
    try {
      const formattedData = {
        cycles: cycles.map(cycle => ({
          startDate: format(parseISO(cycle.startDate), "MMMM d, yyyy"),
          endDate: format(parseISO(cycle.endDate), "MMMM d, yyyy"),
          cycleLength: cycle.cycleLength || "-",
          periodLength: cycle.periodLength || differenceInDays(parseISO(cycle.endDate), parseISO(cycle.startDate)) + 1,
          days: cycle.days.map(day => ({
            date: format(parseISO(day.date), "MMMM d, yyyy"),
            flow: day.flow,
            symptoms: day.symptoms || [],
            mood: day.mood || "-",
            notes: day.notes || ""
          })),
          notes: cycle.notes || ""
        }))
      };
      
      const dataStr = JSON.stringify(formattedData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `shetrack-data-${format(new Date(), "yyyy-MM-dd")}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export successful",
        description: "Your data has been exported successfully."
      });
    } catch (error) {
      console.error("Export failed", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCycle = (id: string) => {
    deleteCycle(id);
    toast({
      title: "Period deleted",
      description: "The selected period data has been removed."
    });
  };

  const differenceInDays = (end: Date, start: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2">
          <HeartPulse className="h-7 w-7 text-primary-foreground" />
          <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-muted-foreground">Customize your SheTrack experience ✨</p>
      </div>

      <div className="space-y-6">
        {/* Preferences Card */}
        <UserPreferencesForm />
        
        {/* Theme Card */}
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle className="font-medium">Appearance</CardTitle>
            </div>
            <CardDescription>Customize the app theme</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p>Theme Mode</p>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
        
        {/* Export Card */}
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="font-medium">Export Data</CardTitle>
            </div>
            <CardDescription>Download your period tracking data</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <p className="text-sm">
                Export all your period tracking data in JSON format for backup or transfer.
              </p>
              <Button onClick={() => {
                handleExportData();
                setShowExportData(!showExportData);
              }} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Management */}
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="font-medium">Period History</CardTitle>
            </div>
            <CardDescription>Manage your tracked periods</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-3">
            {cycles.length > 0 ? (
              <ScrollArea className="h-[250px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cycles].reverse().map((cycle) => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">
                          {format(parseISO(cycle.startDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10">
                            {cycle.periodLength || differenceInDays(parseISO(cycle.endDate), parseISO(cycle.startDate)) + 1} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {cycle.cycleLength ? `${cycle.cycleLength} days` : "-"}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Period Record</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the period data 
                                  starting on {format(parseISO(cycle.startDate), "MMMM d, yyyy")}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCycle(cycle.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No period data recorded yet</p>
                <p className="text-sm mt-1">
                  Add your period in the calendar to start tracking
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
