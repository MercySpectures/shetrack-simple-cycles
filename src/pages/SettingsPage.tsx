
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { usePeriodTracking } from "@/lib/period-context";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { cycles } = usePeriodTracking();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
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
  
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
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
        </div>
        
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Premium Features</h2>
          <div className="rounded-lg bg-secondary/50 p-4 space-y-4">
            <h3 className="font-medium">Unlock Premium for ₹99</h3>
            <ul className="text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-primary-foreground">✓</span>
                <span>Period reminders</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-foreground">✓</span>
                <span>Export data (PDF/CSV)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-foreground">✓</span>
                <span>Add notes (pain, mood, symptoms)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-foreground">✓</span>
                <span>Ovulation & fertile window prediction</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-foreground">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
        
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Data Management</h2>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={cycles.length === 0}
            >
              Export Data
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive"
              onClick={handleClearData}
              disabled={cycles.length === 0}
            >
              Clear All Data
            </Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="text-sm text-muted-foreground">
            SheTrack v1.0.0 - A simple, clean, and efficient period tracker.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Your data is stored locally on your device for privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
