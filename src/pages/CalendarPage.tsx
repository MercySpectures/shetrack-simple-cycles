
import { useState } from "react";
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { CycleChart } from "@/components/CycleChart";
import { PeriodNotes } from "@/components/PeriodNotes";
import { Reminders } from "@/components/Reminders"; 
import { UserPreferencesForm } from "@/components/UserPreferencesForm";
import { CalendarDays, BarChart3, HeartPulse, BellRing, CalendarPlus, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2">
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 w-9 h-9 bg-pink-200 rounded-full animate-pulse opacity-50" />
            <HeartPulse className="h-7 w-7 text-primary-foreground relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent ml-1">
            Calendar
          </span>
        </h1>
        <p className="text-muted-foreground">Track and predict your cycle rhythm ✨</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <ScrollText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-1">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Reminders</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-1">
            <CalendarPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-8">
        <TabsContent value="calendar" className="space-y-8 mt-0">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
            <PeriodCalendar onDateSelect={setSelectedDate} />
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 font-poppins">
              <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
              <BarChart3 className="h-5 w-5 text-primary" />
              Cycle Analysis
            </h2>
            <div className="rounded-xl overflow-hidden shadow-sm">
              <CycleChart />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            <ScrollText className="h-5 w-5 text-primary" />
            Notes for {selectedDate ? selectedDate.toLocaleDateString() : "Today"}
          </h2>
          <PeriodNotes date={selectedDate} />
        </TabsContent>
        
        <TabsContent value="reminders" className="mt-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            <BellRing className="h-5 w-5 text-primary" />
            Reminders
          </h2>
          <Reminders />
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-0">
          <UserPreferencesForm />
        </TabsContent>
      </div>
    </div>
  );
};

export default CalendarPage;
