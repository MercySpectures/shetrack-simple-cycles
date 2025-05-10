
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, DownloadCloud, Trash2, Info, Heart, Shield, Calendar, Settings, User, Bell } from "lucide-react";
import { usePeriodTracking } from "@/lib/period-context";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { cycles } = usePeriodTracking();
  
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
      localStorage.removeItem("shetrack-cycles");
      toast({
        title: "Data Cleared",
        description: "All your period tracking data has been deleted.",
      });
      // Force reload to update context
      window.location.reload();
    }
  };
  
  const handleExportData = () => {
    try {
      // Create a more human-readable format for export
      const formattedData = cycles.map(cycle => {
        const startDate = new Date(cycle.startDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const endDate = new Date(cycle.endDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const formattedDays = cycle.days.map(day => {
          const date = new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return {
            date,
            flow: day.flow,
            symptoms: day.symptoms || []
          };
        });
        
        return {
          period: {
            start: startDate,
            end: endDate
          },
          cycleLength: cycle.cycleLength,
          periodLength: cycle.periodLength,
          days: formattedDays
        };
      });
      
      // Create formatted JSON with indentation
      const dataStr = JSON.stringify({
        userData: {
          totalCycles: cycles.length,
          exportDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          cycles: formattedData
        }
      }, null, 2);
      
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `shetrack-data-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data Exported Successfully",
        description: "Your period tracking data has been exported in a readable format.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your data.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins flex items-center justify-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-center">Customize your experience ✨</p>
      </div>
      
      <div className="space-y-6">
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-lg font-poppins flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-lg font-poppins flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex gap-2 hover:bg-primary/5" 
              onClick={handleExportData}
              disabled={cycles.length === 0}
            >
              <DownloadCloud className="h-4 w-4" />
              Export Data
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive hover:bg-red-50 flex gap-2"
              onClick={handleClearData}
              disabled={cycles.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-lg font-poppins flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm font-medium">
              SheTrack v1.0.0 - A simple, clean, and efficient period tracker.
            </p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Your data is stored locally on your device for complete privacy.
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-500" />
                Features:
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2 items-center">
                  <span className="text-primary-foreground">✓</span>
                  <span>Period tracking and predictions</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary-foreground">✓</span>
                  <span>Cycle analysis and insights</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary-foreground">✓</span>
                  <span>Fertility window & ovulation forecasts</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary-foreground">✓</span>
                  <span>Symptom & mood tracking</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary-foreground">✓</span>
                  <span>Human-readable data export</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
