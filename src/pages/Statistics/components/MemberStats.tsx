
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users } from 'lucide-react';
import { MemberData, ChartConfig, MembershipTypeData } from '../types/statistics';
import { StatsSummaryCards } from './StatsSummaryCards';
import { MembershipChart } from './MembershipChart';

interface MemberStatsProps {
  memberData: MemberData[];
  memberChartConfig: ChartConfig;
  membershipTypeData: MembershipTypeData[];
  businessName: string;
}

export const MemberStats = ({ 
  memberData, 
  memberChartConfig, 
  membershipTypeData, 
  businessName 
}: MemberStatsProps) => {
  const currentMonthData = memberData[memberData.length - 1];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="shadow-xl border bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="pb-6 bg-slate-50/70 dark:bg-slate-800/20 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              월별 회원 현황
            </CardTitle>
            <CardDescription className="text-base">{businessName} 회원 변화 추이</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="w-full overflow-hidden">
              <ChartContainer config={memberChartConfig} className="h-[350px] w-full">
                <BarChart data={memberData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="total" 
                    name="총 회원수" 
                    fill="var(--color-total)" 
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar 
                    dataKey="active" 
                    name="활성 회원" 
                    fill="var(--color-active)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar 
                    dataKey="lesson" 
                    name="개인레슨 회원" 
                    fill="var(--color-lesson)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar 
                    dataKey="inactive" 
                    name="휴면 회원" 
                    fill="var(--color-inactive)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <MembershipChart data={membershipTypeData} />
      </div>
      
      <StatsSummaryCards currentMonthData={currentMonthData} businessName={businessName} />
    </div>
  );
};
