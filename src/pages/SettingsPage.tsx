
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, DownloadCloud, Trash2, Info } from "lucide-react";
import { usePeriodTracking } from "@/lib/period-context";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      const dataStr = JSON.stringify(cycles, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `shetrack-data-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data Exported",
        description: "Your period tracking data has been exported successfully.",
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
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex gap-2" 
              onClick={handleExportData}
              disabled={cycles.length === 0}
            >
              <DownloadCloud className="h-4 w-4" />
              Export Data
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive flex gap-2"
              onClick={handleClearData}
              disabled={cycles.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              SheTrack v1.0.0 - A simple, clean, and efficient period tracker.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Your data is stored locally on your device for complete privacy.
              No personal information is collected or shared with third parties.
            </p>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Features:</h3>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary-foreground">✓</span>
                  <span>Period tracking</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-foreground">✓</span>
                  <span>Cycle analysis and predictions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-foreground">✓</span>
                  <span>Fertility window & ovulation prediction</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-foreground">✓</span>
                  <span>Symptom & mood tracking</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-foreground">✓</span>
                  <span>Local data export</span>
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
