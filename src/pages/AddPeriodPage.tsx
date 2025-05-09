
import { PeriodForm } from "@/components/PeriodForm";

const AddPeriodPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Period</h1>
        <p className="text-muted-foreground">Record your menstrual cycle</p>
      </div>
      
      <PeriodForm />
    </div>
  );
};

export default AddPeriodPage;
