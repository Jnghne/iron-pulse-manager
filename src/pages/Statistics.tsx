
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">통계 대시보드</h1>
          <p className="text-muted-foreground">{currentBusiness}의 운영 현황을 확인합니다.</p>
        </div>
      </div>
      
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">회원 통계</TabsTrigger>
          <TabsTrigger value="revenue">매출 통계</TabsTrigger>
          <TabsTrigger value="staff">직원 실적</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  월별 회원 현황
                </CardTitle>
                <CardDescription>{currentBusiness} 회원 변화 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={memberChartConfig} className="h-[350px]">
                  <BarChart data={memberData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
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
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="active" 
                      name="활성 회원" 
                      fill="var(--color-active)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="pt" 
                      name="PT 회원" 
                      fill="var(--color-pt)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="inactive" 
                      name="휴면 회원" 
                      fill="var(--color-inactive)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  회원권 유형 분포
                </CardTitle>
                <CardDescription>현재 등록된 회원권 유형별 현황</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer config={{}} className="h-[350px]">
                  <PieChart>
                    <Pie
                      data={membershipTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
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
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">{data.name}</span>
                                  <span className="font-medium">{data.value}명</span>
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
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                회원 요약
              </CardTitle>
              <CardDescription>{currentBusiness} 회원 현황 세부사항</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20">
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">{currentMonthData.total}</div>
                  <div className="text-sm text-muted-foreground">총 회원 수</div>
                </div>
                <div className="text-center p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20">
                  <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">{currentMonthData.active}</div>
                  <div className="text-sm text-muted-foreground">활성 회원</div>
                </div>
                <div className="text-center p-6 border rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/20">
                  <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2">{currentMonthData.pt}</div>
                  <div className="text-sm text-muted-foreground">PT 회원</div>
                </div>
                <div className="text-center p-6 border rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/20">
                  <div className="text-3xl font-bold text-slate-700 dark:text-slate-400 mb-2">{currentMonthData.inactive}</div>
                  <div className="text-sm text-muted-foreground">휴면 회원</div>
                </div>
                <div className="text-center p-6 border rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/20 dark:to-sky-900/20">
                  <div className="text-3xl font-bold text-sky-700 dark:text-sky-400 mb-2">32</div>
                  <div className="text-sm text-muted-foreground">신규 회원</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                월별 매출 현황
              </CardTitle>
              <CardDescription>{currentBusiness} 매출 변화 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="h-[400px]">
                <AreaChart data={revenueData}>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
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
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <TrendingUp className="h-5 w-5" />
                  수입 요약 (5월)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="text-sm font-medium">총 매출</div>
                    <div className="font-bold text-lg">{totalCurrentRevenue.toLocaleString()}원</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">회원권 매출</div>
                    <div className="font-bold">{currentRevenue.membership.toLocaleString()}원 ({Math.round((currentRevenue.membership / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">PT 이용권 매출</div>
                    <div className="font-bold">{currentRevenue.pt.toLocaleString()}원 ({Math.round((currentRevenue.pt / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">일일권 매출</div>
                    <div className="font-bold">{currentRevenue.daily.toLocaleString()}원 ({Math.round((currentRevenue.daily / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">기타 매출</div>
                    <div className="font-bold">{currentRevenue.other.toLocaleString()}원 ({Math.round((currentRevenue.other / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <TrendingDown className="h-5 w-5" />
                  지출 요약 (5월)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="text-sm font-medium">총 지출</div>
                    <div className="font-bold text-lg text-red-600 dark:text-red-400">4,850,000원</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">인건비</div>
                    <div className="font-bold">3,200,000원 (66.0%)</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">임대료</div>
                    <div className="font-bold">1,000,000원 (20.6%)</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">수도/전기</div>
                    <div className="font-bold">350,000원 (7.2%)</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                    <div className="text-sm font-medium">기타 경비</div>
                    <div className="font-bold">300,000원 (6.2%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                직원 실적
              </CardTitle>
              <CardDescription>직원별 PT 수업 및 매출 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="font-semibold">직원명</TableHead>
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
                    <TableRow key={staff.name} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell className="text-center">{staff.pt}회</TableCell>
                      <TableCell className="text-center font-semibold text-green-600 dark:text-green-400">
                        {staff.revenue.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium">
                          ⭐ {staff.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">{staff.newMembers}명</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                          className="font-medium"
                        >
                          {staff.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
