
import React from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format, parseISO, differenceInDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/lib/theme-provider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

type ChartDataItem = {
  month: string;
  length: number;
  periodLength: number;
};

export function CycleChart() {
  const { cycles, getAverageCycleLength, getAveragePeriodLength } = usePeriodTracking();
  const { theme } = useTheme();
  
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
  
  // Chart config for colors
  const chartConfig = {
    cycleLength: {
      label: "Cycle Length",
      theme: {
        light: "#9b87f5",
        dark: "#b59dff"
      }
    },
    periodLength: {
      label: "Period Length",
      theme: {
        light: "#FFA5BA",
        dark: "#FF8AAB" 
      }
    }
  };
  
  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle>Cycle Analysis</CardTitle>
          <CardDescription>Track your cycle patterns over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Add periods to see your cycle analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle>Cycle Analysis</CardTitle>
        <CardDescription>Track your cycle patterns over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ChartContainer 
            config={chartConfig}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-border/30
                       [&_.recharts-cartesian-grid-vertical_line]:stroke-border/0
                       [&_.recharts-cartesian-axis-line]:stroke-border/50
                       [&_.recharts-xAxis_.recharts-cartesian-axis-tick-value]:fill-muted-foreground
                       [&_.recharts-yAxis_.recharts-cartesian-axis-tick-value]:fill-muted-foreground"
          >
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={true} 
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                allowDecimals={false} 
                axisLine={true} 
                tickLine={false} 
                fontSize={12}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    nameKey="label"
                    labelKey="month"
                    formatter={(value) => `${value} days`}
                  />
                }
              />
              <Bar 
                dataKey="length" 
                name="cycleLength" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
              />
              <Bar 
                dataKey="periodLength" 
                name="periodLength" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
