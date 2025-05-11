
import React from "react";
import { usePeriodTracking } from "@/lib/period-context";
import { format, parseISO, differenceInDays } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
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
        light: "url(#cycleGradient)",
        dark: "url(#cycleGradientDark)"
      }
    },
    periodLength: {
      label: "Period Length",
      theme: {
        light: "url(#periodGradient)",
        dark: "url(#periodGradientDark)" 
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
        <CardContent className="h-[250px] flex items-center justify-center">
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
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4}>
              <defs>
                <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b87f5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#b59dff" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="periodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF8AAB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FFA5BA" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="cycleGradientDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b59dff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#9b87f5" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="periodGradientDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF8AAB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FFA5BA" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.3} />
              <XAxis 
                dataKey="month" 
                axisLine={true} 
                tickLine={false}
                fontSize={12}
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <YAxis 
                allowDecimals={false} 
                axisLine={true} 
                tickLine={false} 
                fontSize={12}
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <Tooltip 
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={`p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className="font-medium text-sm">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-xs flex items-center gap-2 mt-1">
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: entry.name === "length" ? "#9b87f5" : "#FF8AAB"
                              }}
                            />
                            <span className="font-medium">
                              {entry.name === "length" ? "Cycle Length: " : "Period Length: "}
                              {entry.value} days
                            </span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  return value === "length" ? "Cycle Length" : "Period Length";
                }}
              />
              <Bar 
                dataKey="length" 
                name="length" 
                fill={theme === 'dark' ? "url(#cycleGradientDark)" : "url(#cycleGradient)"} 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                dataKey="periodLength" 
                name="periodLength" 
                fill={theme === 'dark' ? "url(#periodGradientDark)" : "url(#periodGradient)"}
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
