
import { useEffect, useRef, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format, parseISO, addDays } from 'date-fns';
import { usePeriodTracking } from '@/lib/period-context';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodPieChart3D } from './PeriodPieChart3D';

export function CycleChart() {
  const { cycles, getPredictedPeriods } = usePeriodTracking();
  const [activeTab, setActiveTab] = useState("cycle-length");
  
  // Generate chart data from cycles
  const generateChartData = () => {
    if (cycles.length < 2) {
      return [];
    }
    
    return cycles
      .filter(cycle => cycle.cycleLength)
      .map(cycle => ({
        date: cycle.startDate,
        cycleLength: cycle.cycleLength,
        periodLength: cycle.periodLength
      }));
  };
  
  const chartData = generateChartData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-md p-3 text-sm">
          <p className="font-medium mb-1">
            {format(parseISO(label), 'MMM d, yyyy')}
          </p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value} {item.name === 'cycleLength' ? 'days' : 'days'}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Tabs defaultValue="cycle-length" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="cycle-length">Cycle Length</TabsTrigger>
        <TabsTrigger value="period-length">Period Length</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
      </TabsList>

      <TabsContent value="cycle-length" className="space-y-4">
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Cycle Length Trends</h3>
              <p className="text-sm text-muted-foreground">
                Track how your cycle length changes over time
              </p>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCycle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Days', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 12, opacity: 0.5 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="cycleLength" 
                    name="Cycle Length"
                    stroke="#8884d8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCycle)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center flex-col text-muted-foreground">
                <p>Not enough cycle data</p>
                <p className="text-xs mt-2">Track at least 2 cycles to see trends</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="period-length" className="space-y-4">
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Period Length Trends</h3>
              <p className="text-sm text-muted-foreground">
                Track how your period length changes over time
              </p>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPeriod" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e91e63" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#e91e63" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Days', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 12, opacity: 0.5 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="periodLength" 
                    name="Period Length"
                    stroke="#e91e63" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPeriod)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center flex-col text-muted-foreground">
                <p>Not enough cycle data</p>
                <p className="text-xs mt-2">Track at least 2 cycles to see trends</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="distribution">
        <PeriodPieChart3D />
      </TabsContent>
    </Tabs>
  );
}
