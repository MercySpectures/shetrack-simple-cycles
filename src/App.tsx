
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";
import { PeriodProvider } from "@/lib/period-context";
import { MobileNavbar } from "@/components/MobileNavbar";
import { ScrollToTop } from "@/components/ScrollToTop";

import Index from "./pages/Index";
import CalendarPage from "./pages/CalendarPage";
import AddPeriodPage from "./pages/AddPeriodPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <PeriodProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground pb-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/add-period" element={<AddPeriodPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNavbar />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </PeriodProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
