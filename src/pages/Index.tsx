
import { useEffect } from "react";
import HomePage from "./HomePage";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  // Ensure the page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto px-4 py-8">
        <OnboardingModal />
        <HomePage />
      </div>
    </ScrollArea>
  );
};

export default Index;
