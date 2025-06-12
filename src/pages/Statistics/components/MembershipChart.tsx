
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from 'recharts';
import { Calendar } from 'lucide-react';
import { MembershipTypeData } from '../types/statistics';

interface MembershipChartProps {
  data: MembershipTypeData[];
}

export const MembershipChart = ({ data }: MembershipChartProps) => {
  return (
    <Card className="shadow-xl border bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="pb-6 bg-slate-50/70 dark:bg-slate-800/20 border-b">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          회원권 유형 분포
        </CardTitle>
        <CardDescription className="text-base">현재 등록된 회원권 유형별 현황</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
        <div className="w-full flex justify-center overflow-hidden">
          <ChartContainer config={{}} className="h-[350px] w-full max-w-[400px]">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                stroke="white"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="rounded-xl border bg-white dark:bg-slate-800 p-3 shadow-lg">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{data.name}</span>
                            <span className="font-semibold">{data.value}명</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
