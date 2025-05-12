
import { PeriodForm } from "@/components/PeriodForm";
import { Plus } from "lucide-react";

const AddPeriodPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2 page-heading">
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 w-9 h-9 bg-pink-200 rounded-full animate-pulse opacity-50" />
            <Plus className="h-7 w-7 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent ml-1">
            Add Period
          </span>
        </h1>
        <p className="text-muted-foreground">Record your menstrual cycle</p>
      </div>
      
      <PeriodForm />
    </div>
  );
};

export default AddPeriodPage;
