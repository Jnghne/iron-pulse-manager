
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { RevenueData, ChartConfig } from '../types/statistics';

interface RevenueStatsProps {
  revenueData: RevenueData[];
  revenueChartConfig: ChartConfig;
  businessName: string;
}

export const RevenueStats = ({ revenueData, revenueChartConfig, businessName }: RevenueStatsProps) => {
  const currentRevenue = revenueData[revenueData.length - 1];
  const totalCurrentRevenue = currentRevenue.membership + currentRevenue.lesson + currentRevenue.daily + currentRevenue.other;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border bg-slate-50/70 dark:bg-slate-800/20 border-b overflow-hidden">
        <CardHeader className="pb-6 bg-slate-50/70 dark:bg-slate-800/20 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            월별 매출 현황
          </CardTitle>
          <CardDescription className="text-base">{businessName} 매출 변화 추이</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="w-full overflow-hidden">
            <ChartContainer config={revenueChartConfig} className="h-[400px] w-full">
              <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="membership" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="lesson" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="daily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="other" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => `${Number(value).toLocaleString()}원`}
                  />} 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area 
                  type="monotone" 
                  dataKey="membership" 
                  stackId="1" 
                  stroke="#8B5CF6" 
                  fill="url(#membership)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="lesson" 
                  stackId="1" 
                  stroke="#06B6D4" 
                  fill="url(#lesson)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="daily" 
                  stackId="1" 
                  stroke="#F97316" 
                  fill="url(#daily)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="other" 
                  stackId="1" 
                  stroke="#EC4899" 
                  fill="url(#other)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="shadow-xl border bg-slate-50/70 dark:bg-slate-800/20 border-b overflow-hidden">
          <CardHeader className="pb-6 bg-slate-50/70 dark:bg-slate-800/20 border-b">
            <CardTitle className="flex items-center gap-3 text-xl text-green-700 dark:text-green-400">
              <TrendingUp className="h-6 w-6" />
              수입 요약 (5월)
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md">
                <div className="text-sm font-semibold">총 매출</div>
                <div className="font-bold text-xl">{totalCurrentRevenue.toLocaleString()}원</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">회원권 매출</div>
                <div className="font-semibold">{currentRevenue.membership.toLocaleString()}원 ({Math.round((currentRevenue.membership / totalCurrentRevenue) * 100)}%)</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">개인레슨 이용권 매출</div>
                <div className="font-semibold">{currentRevenue.lesson.toLocaleString()}원 ({Math.round((currentRevenue.lesson / totalCurrentRevenue) * 100)}%)</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">일일권 매출</div>
                <div className="font-semibold">{currentRevenue.daily.toLocaleString()}원 ({Math.round((currentRevenue.daily / totalCurrentRevenue) * 100)}%)</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">기타 매출</div>
                <div className="font-semibold">{currentRevenue.other.toLocaleString()}원 ({Math.round((currentRevenue.other / totalCurrentRevenue) * 100)}%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl border bg-slate-50/70 dark:bg-slate-800/20 border-b overflow-hidden">
          <CardHeader className="pb-6 bg-slate-50/70 dark:bg-slate-800/20 border-b">
            <CardTitle className="flex items-center gap-3 text-xl text-red-700 dark:text-red-400">
              <TrendingDown className="h-6 w-6" />
              지출 요약 (5월)
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md">
                <div className="text-sm font-semibold">총 지출</div>
                <div className="font-bold text-xl text-red-600 dark:text-red-400">4,850,000원</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">인건비</div>
                <div className="font-semibold">3,200,000원 (66.0%)</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">임대료</div>
                <div className="font-semibold">1,000,000원 (20.6%)</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">수도/전기</div>
                <div className="font-semibold">350,000원 (7.2%)</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                <div className="text-sm font-medium">기타 경비</div>
                <div className="font-semibold">300,000원 (6.2%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
