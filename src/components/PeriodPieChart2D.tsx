
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePeriodTracking } from "@/lib/period-context";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PeriodPieChart2D() {
  const { getAverageCycleLength, getAveragePeriodLength } = usePeriodTracking();
  
  const avgCycleLength = getAverageCycleLength();
  const avgPeriodLength = getAveragePeriodLength();
  const fertileLength = 6; // Average fertile window (5 days + ovulation)
  const remainingDays = avgCycleLength - avgPeriodLength - fertileLength;
  
  const data = [
    { name: "Period", value: avgPeriodLength, color: "#F9A8D4" },  // Pink
    { name: "Fertile Window", value: fertileLength, color: "#7EB0FF" },  // Blue
    { name: "Other Days", value: remainingDays, color: "#86EFAC" }  // Green
  ];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-md border border-border rounded-md text-xs">
          <p className="font-semibold">{`${payload[0].name}: ${payload[0].value} days`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="overflow-hidden border-primary/20 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex justify-center flex-col items-center">
          <h3 className="text-lg font-medium text-center bg-gradient-to-r from-pink-500 to-primary text-transparent bg-clip-text dark:from-primary-foreground dark:to-primary-foreground/80">
            Period Distribution
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            How your cycle is typically distributed
          </p>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                className="drop-shadow-md"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-2 flex-wrap text-xs">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
            <span>{avgPeriodLength} days: Period</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>6 days: Fertile Window</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>{remainingDays} days: Other</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
