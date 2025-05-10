
import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  usePeriodTracking, 
  FlowIntensity, 
  PeriodDay 
} from "@/lib/period-context";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const periodFormSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  flow: z.enum(["light", "medium", "heavy"], {
    required_error: "Please select flow intensity",
  }),
  symptoms: z.array(z.string()).default([]),
  mood: z.enum(["happy", "neutral", "sad"], {
    required_error: "Please select your mood",
  }).default("neutral"),
});

type PeriodFormValues = z.infer<typeof periodFormSchema>;

export function PeriodForm() {
  const { addCycle, getAveragePeriodLength } = usePeriodTracking();
  const { toast } = useToast();
  const [calculatedEndDate, setCalculatedEndDate] = useState<Date | null>(null);
  
  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(periodFormSchema),
    defaultValues: {
      flow: "medium",
      symptoms: [],
      mood: "neutral",
    },
  });

  // Update end date whenever start date changes
  useEffect(() => {
    const startDate = form.watch("startDate");
    if (startDate) {
      const avgPeriodLength = getAveragePeriodLength();
      setCalculatedEndDate(addDays(startDate, avgPeriodLength - 1));
    }
  }, [form.watch("startDate"), getAveragePeriodLength]);

  function onSubmit(data: PeriodFormValues) {
    const { startDate, flow, symptoms, mood } = data;
    
    if (!calculatedEndDate) {
      toast({
        title: "Error",
        description: "End date could not be calculated",
        variant: "destructive"
      });
      return;
    }
    
    const endDate = calculatedEndDate;
    
    // Create period days array
    const days: PeriodDay[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push({
        date: format(currentDate, "yyyy-MM-dd"),
        flow: flow as FlowIntensity,
        symptoms: symptoms,
        mood: mood,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add period cycle
    addCycle(
      format(startDate, "yyyy-MM-dd"), 
      format(endDate, "yyyy-MM-dd"), 
      days
    );
    
    toast({
      title: "Period Added",
      description: "Your cycle has been recorded",
    });

    form.reset();
    setCalculatedEndDate(null);
  }

  // Available symptoms
  const symptomOptions = [
    { value: "cramps", label: "Cramps" },
    { value: "headache", label: "Headache" },
    { value: "bloating", label: "Bloating" },
    { value: "fatigue", label: "Fatigue" },
    { value: "backache", label: "Backache" },
    { value: "tender_breasts", label: "Tender Breasts" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When did your period start?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {calculatedEndDate && (
          <Card className="bg-secondary/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Estimated end date:</p>
                <p className="font-semibold text-primary">{format(calculatedEndDate, "PPP")}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on your average period length of {getAveragePeriodLength()} days
              </p>
            </CardContent>
          </Card>
        )}
        
        <FormField
          control={form.control}
          name="flow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flow Intensity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flow intensity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the average flow intensity for this period
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptoms</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2 mt-1">
                  {symptomOptions.map((symptom) => (
                    <Badge
                      key={symptom.value}
                      variant={field.value.includes(symptom.value) ? "default" : "outline"}
                      className="cursor-pointer py-1 px-2"
                      onClick={() => {
                        const updatedValue = field.value.includes(symptom.value)
                          ? field.value.filter((v) => v !== symptom.value)
                          : [...field.value, symptom.value];
                        field.onChange(updatedValue);
                      }}
                    >
                      {symptom.label}
                      {field.value.includes(symptom.value) && (
                        <Check className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Select any symptoms you are experiencing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Mood</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4 justify-center pt-2"
                >
                  <FormItem className="flex flex-col items-center space-y-1">
                    <FormControl>
                      <RadioGroupItem value="happy" className="sr-only" />
                    </FormControl>
                    <div className={`text-3xl p-3 rounded-full cursor-pointer ${field.value === 'happy' ? 'bg-primary/20' : ''}`}>
                      😊
                    </div>
                    <FormLabel className="text-xs">Happy</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-col items-center space-y-1">
                    <FormControl>
                      <RadioGroupItem value="neutral" className="sr-only" />
                    </FormControl>
                    <div className={`text-3xl p-3 rounded-full cursor-pointer ${field.value === 'neutral' ? 'bg-primary/20' : ''}`}>
                      😐
                    </div>
                    <FormLabel className="text-xs">Neutral</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-col items-center space-y-1">
                    <FormControl>
                      <RadioGroupItem value="sad" className="sr-only" />
                    </FormControl>
                    <div className={`text-3xl p-3 rounded-full cursor-pointer ${field.value === 'sad' ? 'bg-primary/20' : ''}`}>
                      😔
                    </div>
                    <FormLabel className="text-xs">Sad</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Add Period</Button>
      </form>
    </Form>
  );
}
