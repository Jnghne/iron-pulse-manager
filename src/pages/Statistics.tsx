
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Award } from 'lucide-react';

// Mock data for demonstration (only for the logged-in business)
const currentBusiness = "강남 피트니스 센터";

const memberData = [
  { name: '1월', total: 120, active: 90, pt: 45, inactive: 30 },
  { name: '2월', total: 135, active: 105, pt: 52, inactive: 30 },
  { name: '3월', total: 150, active: 118, pt: 58, inactive: 32 },
  { name: '4월', total: 142, active: 110, pt: 55, inactive: 32 },
  { name: '5월', total: 165, active: 130, pt: 65, inactive: 35 },
];

const revenueData = [
  { month: '1월', membership: 3200000, pt: 1800000, daily: 450000, other: 200000 },
  { month: '2월', membership: 3500000, pt: 2100000, daily: 480000, other: 250000 },
  { month: '3월', membership: 3700000, pt: 2300000, daily: 510000, other: 300000 },
  { month: '4월', membership: 3200000, pt: 2000000, daily: 470000, other: 270000 },
  { month: '5월', membership: 3900000, pt: 2400000, daily: 550000, other: 320000 },
];

const staffData = [
  { name: '김직원', pt: 45, revenue: 4500000, rating: 4.8, newMembers: 12, retentionRate: 85, status: '정상' },
  { name: '이직원', pt: 38, revenue: 3800000, rating: 4.6, newMembers: 9, retentionRate: 78, status: '정상' },
  { name: '박직원', pt: 30, revenue: 3000000, rating: 4.7, newMembers: 8, retentionRate: 82, status: '정상' },
  { name: '최직원', pt: 25, revenue: 2500000, rating: 4.5, newMembers: 6, retentionRate: 75, status: '휴직' },
];

// Chart configuration with modern colors and better accessibility
const memberChartConfig = {
  total: {
    label: "총 회원수",
    color: "hsl(var(--primary))",
  },
  active: {
    label: "활성 회원",
    color: "hsl(142 76% 36%)",
  },
  pt: {
    label: "PT 회원",
    color: "hsl(38 92% 50%)",
  },
  inactive: {
    label: "휴면 회원",
    color: "hsl(215 14% 34%)",
  },
};

const revenueChartConfig = {
  membership: {
    label: "회원권",
    color: "hsl(var(--primary))",
  },
  pt: {
    label: "PT 이용권",
    color: "hsl(142 76% 36%)",
  },
  daily: {
    label: "일일권",
    color: "hsl(38 92% 50%)",
  },
  other: {
    label: "기타",
    color: "hsl(262 83% 58%)",
  },
};

const membershipTypeData = [
  { name: '1개월', value: 45, fill: 'hsl(var(--primary))' },
  { name: '3개월', value: 30, fill: 'hsl(199 89% 48%)' },
  { name: '6개월', value: 15, fill: 'hsl(142 76% 36%)' },
  { name: '12개월', value: 10, fill: 'hsl(38 92% 50%)' },
];

const Statistics = () => {
  // 현재 월 데이터
  const currentMonthData = memberData[memberData.length - 1];
  const previousMonthData = memberData[memberData.length - 2];
  const currentRevenue = revenueData[revenueData.length - 1];
  const previousRevenue = revenueData[revenueData.length - 2];

  // 성장률 계산
  const memberGrowth = ((currentMonthData.total - previousMonthData.total) / previousMonthData.total * 100).toFixed(1);
  const revenueGrowth = (((currentRevenue.membership + currentRevenue.pt + currentRevenue.daily + currentRevenue.other) - 
    (previousRevenue.membership + previousRevenue.pt + previousRevenue.daily + previousRevenue.other)) /
    (previousRevenue.membership + previousRevenue.pt + previousRevenue.daily + previousRevenue.other) * 100).toFixed(1);

  const totalCurrentRevenue = currentRevenue.membership + currentRevenue.pt + currentRevenue.daily + currentRevenue.other;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 lg:p-6 xl:p-8 space-y-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              통계 대시보드
            </h1>
            <p className="text-lg text-muted-foreground">{currentBusiness}의 운영 현황을 확인합니다.</p>
          </div>
        </div>
        
        <Tabs defaultValue="members" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-14 p-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border shadow-lg">
            <TabsTrigger value="members" className="text-sm font-medium">회원 통계</TabsTrigger>
            <TabsTrigger value="revenue" className="text-sm font-medium">매출 통계</TabsTrigger>
            <TabsTrigger value="staff" className="text-sm font-medium">직원 실적</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    월별 회원 현황
                  </CardTitle>
                  <CardDescription className="text-base">{currentBusiness} 회원 변화 추이</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                          dataKey="pt" 
                          name="PT 회원" 
                          fill="var(--color-pt)"
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
              
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    회원권 유형 분포
                  </CardTitle>
                  <CardDescription className="text-base">현재 등록된 회원권 유형별 현황</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="w-full flex justify-center overflow-hidden">
                    <ChartContainer config={{}} className="h-[350px] w-full max-w-[400px]">
                      <PieChart>
                        <Pie
                          data={membershipTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          innerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="hsl(var(--background))"
                          strokeWidth={3}
                        >
                          {membershipTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];
                              return (
                                <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
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
            </div>
            
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                    <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  회원 요약
                </CardTitle>
                <CardDescription className="text-base">{currentBusiness} 회원 현황 세부사항</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30 shadow-lg">
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">{currentMonthData.total}</div>
                    <div className="text-sm font-medium text-muted-foreground">총 회원 수</div>
                  </div>
                  <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/30 shadow-lg">
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">{currentMonthData.active}</div>
                    <div className="text-sm font-medium text-muted-foreground">활성 회원</div>
                  </div>
                  <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/30 shadow-lg">
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2">{currentMonthData.pt}</div>
                    <div className="text-sm font-medium text-muted-foreground">PT 회원</div>
                  </div>
                  <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/30 shadow-lg">
                    <div className="text-3xl font-bold text-slate-700 dark:text-slate-400 mb-2">{currentMonthData.inactive}</div>
                    <div className="text-sm font-medium text-muted-foreground">휴면 회원</div>
                  </div>
                  <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/30 dark:to-sky-900/30 shadow-lg">
                    <div className="text-3xl font-bold text-sky-700 dark:text-sky-400 mb-2">32</div>
                    <div className="text-sm font-medium text-muted-foreground">신규 회원</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-8">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg overflow-hidden">
              <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  월별 매출 현황
                </CardTitle>
                <CardDescription className="text-base">{currentBusiness} 매출 변화 추이</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="w-full overflow-hidden">
                  <ChartContainer config={revenueChartConfig} className="h-[400px] w-full">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="membership" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="pt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="daily" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="other" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0.1}/>
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
                        stroke="hsl(var(--primary))" 
                        fill="url(#membership)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pt" 
                        stackId="1" 
                        stroke="hsl(142 76% 36%)" 
                        fill="url(#pt)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="daily" 
                        stackId="1" 
                        stroke="hsl(38 92% 50%)" 
                        fill="url(#daily)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="other" 
                        stackId="1" 
                        stroke="hsl(262 83% 58%)" 
                        fill="url(#other)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/30 backdrop-blur-lg overflow-hidden">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl text-green-700 dark:text-green-400">
                    <TrendingUp className="h-6 w-6" />
                    수입 요약 (5월)
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                      <div className="text-sm font-medium">PT 이용권 매출</div>
                      <div className="font-semibold">{currentRevenue.pt.toLocaleString()}원 ({Math.round((currentRevenue.pt / totalCurrentRevenue) * 100)}%)</div>
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
              
              <Card className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-pink-100/50 dark:from-red-950/30 dark:to-pink-900/30 backdrop-blur-lg overflow-hidden">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl text-red-700 dark:text-red-400">
                    <TrendingDown className="h-6 w-6" />
                    지출 요약 (5월)
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
          </TabsContent>
          
          <TabsContent value="staff" className="space-y-8">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                    <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  직원 실적
                </CardTitle>
                <CardDescription className="text-base">직원별 PT 수업 및 매출 현황</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead className="font-semibold text-center">직원명</TableHead>
                        <TableHead className="text-center font-semibold">PT 수업 수</TableHead>
                        <TableHead className="text-center font-semibold">매출</TableHead>
                        <TableHead className="text-center font-semibold">평점</TableHead>
                        <TableHead className="text-center font-semibold">신규 회원</TableHead>
                        <TableHead className="text-center font-semibold">회원 유지율</TableHead>
                        <TableHead className="text-center font-semibold">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData.map((staff) => (
                        <TableRow key={staff.name} className="border-border/50 hover:bg-muted/20">
                          <TableCell className="font-semibold text-center">{staff.name}</TableCell>
                          <TableCell className="text-center font-medium">{staff.pt}회</TableCell>
                          <TableCell className="text-center font-semibold text-green-600 dark:text-green-400">
                            {staff.revenue.toLocaleString()}원
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-semibold">
                              ⭐ {staff.rating}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-medium">{staff.newMembers}명</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              staff.retentionRate >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                              staff.retentionRate >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {staff.retentionRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={staff.status === '정상' ? 'default' : staff.status === '휴직' ? 'secondary' : 'destructive'}
                              className="font-semibold"
                            >
                              {staff.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
