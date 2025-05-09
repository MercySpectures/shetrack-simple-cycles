
import React from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format, parseISO, differenceInDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type ChartDataItem = {
  month: string;
  length: number;
  periodLength: number;
};

export function CycleChart() {
  const { cycles, getAverageCycleLength, getAveragePeriodLength } = usePeriodTracking();
  
  // Create chart data from cycles
  const chartData: ChartDataItem[] = [];
  
  // Only process if we have at least 2 cycles to calculate cycle length
  if (cycles.length >= 2) {
    for (let i = 1; i < cycles.length; i++) {
      const current = parseISO(cycles[i].startDate);
      const previous = parseISO(cycles[i-1].startDate);
      const cycleLength = differenceInDays(current, previous);
      
      const periodLength = differenceInDays(
        parseISO(cycles[i-1].endDate),
        parseISO(cycles[i-1].startDate)
      ) + 1;
      
      chartData.push({
        month: format(previous, "MMM"),
        length: cycleLength,
        periodLength: periodLength
      });
    }
  }
  
  // If we have at least one cycle, add the current cycle
  if (cycles.length > 0) {
    const lastCycle = cycles[cycles.length - 1];
    const periodLength = differenceInDays(
      parseISO(lastCycle.endDate),
      parseISO(lastCycle.startDate)
    ) + 1;
    
    chartData.push({
      month: format(parseISO(lastCycle.startDate), "MMM"),
      length: getAverageCycleLength(),
      periodLength: periodLength
    });
  }
  
  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cycle Analysis</CardTitle>
          <CardDescription>Track your cycle patterns over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Add periods to see your cycle analysis</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartConfig = {
    length: {
      label: "Cycle Length",
      color: "#9b87f5"
    },
    periodLength: {
      label: "Period Length",
      color: "#FDE1D3"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cycle Analysis</CardTitle>
        <CardDescription>Track your cycle patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                content={(props) => (
                  <ChartTooltipContent
                    {...props}
                    formatter={(value, name) => {
                      return `${value} days`;
                    }}
                  />
                )}
              />
              <Bar dataKey="length" fill="#9b87f5" name="Cycle Length" radius={[4, 4, 0, 0]} />
              <Bar dataKey="periodLength" fill="#FDE1D3" name="Period Length" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
