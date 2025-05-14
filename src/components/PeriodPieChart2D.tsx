
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePeriodTracking } from "@/lib/period-context";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartPie } from 'lucide-react';

export function PeriodPieChart2D() {
  const { getAverageCycleLength, getAveragePeriodLength } = usePeriodTracking();
  
  const avgCycleLength = getAverageCycleLength();
  const avgPeriodLength = getAveragePeriodLength();
  const fertileLength = 6; // Average fertile window (5 days + ovulation)
  const remainingDays = avgCycleLength - avgPeriodLength - fertileLength;
  
  const data = [
    { name: "Period", value: avgPeriodLength, color: "#D946EF" },  // Vibrant Magenta
    { name: "Fertile Window", value: fertileLength, color: "#0EA5E9" },  // Ocean Blue
    { name: "Other Days", value: remainingDays, color: "#8B5CF6" }  // Vivid Purple
  ];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-md border border-border rounded-md text-xs backdrop-blur-sm">
          <p className="font-semibold">{`${payload[0].name}: ${payload[0].value} days`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="overflow-hidden border-primary/20 shadow-md">
      <CardContent className="p-4">
        <div className="mb-4 flex justify-center flex-col items-center">
          <h3 className="text-lg font-medium text-center bg-gradient-to-r from-pink-500 to-primary text-transparent bg-clip-text dark:from-primary-foreground dark:to-primary-foreground/80 flex items-center gap-2">
            <ChartPie className="h-5 w-5 text-primary" />
            <span>Period Distribution</span>
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
                innerRadius={65}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
                className="drop-shadow-lg"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all duration-300 hover:opacity-90 hover:scale-105"
                    stroke="white"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value, entry, index) => (
                  <span className="text-xs font-medium">{value}</span>
                )}
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-4 mt-2 flex-wrap text-xs">
          <div className="flex items-center gap-2 animate-fade-in p-1 rounded-full bg-background shadow-sm border border-border/20">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#D946EF" }}></div>
            <span>{avgPeriodLength} days: Period</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in p-1 rounded-full bg-background shadow-sm border border-border/20" style={{ animationDelay: '0.2s' }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0EA5E9" }}></div>
            <span>6 days: Fertile Window</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in p-1 rounded-full bg-background shadow-sm border border-border/20" style={{ animationDelay: '0.4s' }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8B5CF6" }}></div>
            <span>{remainingDays} days: Other</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
