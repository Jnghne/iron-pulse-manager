
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { mockRevenueData, mockMonthlyRevenueData, mockVisitorsData } from "@/data/mockData";
import { TrendingUp, TrendingDown, Users, CreditCard, Activity } from "lucide-react";

// Get today's visitor count
const getTodayVisitors = () => {
  return mockVisitorsData[0].total;
};

// Get this week's visitor count
const getWeeklyVisitors = () => {
  return mockVisitorsData.slice(0, 7).reduce((sum, day) => sum + day.total, 0);
};

// Get today's revenue
const getTodayRevenue = () => {
  return mockRevenueData[0].total;
};

// Get this month's revenue
const getMonthlyRevenue = () => {
  return mockRevenueData.slice(0, 30).reduce((sum, day) => sum + day.total, 0);
};

// Function to get revenue change percentage
const getRevenueChange = (period: 'daily' | 'monthly') => {
  if (period === 'daily') {
    const today = mockRevenueData[0].total;
    const yesterday = mockRevenueData[1].total;
    return ((today - yesterday) / yesterday) * 100;
  } else {
    const thisMonth = mockMonthlyRevenueData[0].total;
    const lastMonth = mockMonthlyRevenueData[1].total;
    return ((thisMonth - lastMonth) / lastMonth) * 100;
  }
};

// Function to get visitor change percentage
const getVisitorChange = (period: 'daily' | 'weekly') => {
  if (period === 'daily') {
    const today = mockVisitorsData[0].total;
    const yesterday = mockVisitorsData[1].total;
    return ((today - yesterday) / yesterday) * 100;
  } else {
    const thisWeek = mockVisitorsData.slice(0, 7).reduce((sum, day) => sum + day.total, 0);
    const lastWeek = mockVisitorsData.slice(7, 14).reduce((sum, day) => sum + day.total, 0);
    return ((thisWeek - lastWeek) / lastWeek) * 100;
  }
};

// Prepare revenue breakdown data for pie chart
const revenueBreakdownData = [
  { name: '회원권', value: mockMonthlyRevenueData[0].membership },
  { name: 'PT 이용권', value: mockMonthlyRevenueData[0].pt },
  { name: '일일권', value: mockMonthlyRevenueData[0].dailyTicket },
  { name: '기타', value: mockMonthlyRevenueData[0].other },
];

// Colors for the charts
const COLORS = ['#4EA8DE', '#8FB4FF', '#A78BFA', '#FB7185'];
const AREA_COLORS = ['#4EA8DE', '#8FB4FF'];

// Prepare daily revenue data for the last 7 days
const dailyRevenueData = mockRevenueData.slice(0, 7).map(item => ({
  date: item.date.substring(5), // Get only MM-DD format
  매출: item.total,
})).reverse();

// Prepare monthly revenue data for the last 6 months
const monthlyRevenueData = mockMonthlyRevenueData.slice(0, 6).map(item => {
  const date = new Date(item.date);
  return {
    date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
    매출: item.total,
  };
}).reverse();

// Prepare visitor data for the last 7 days
const visitorData = mockVisitorsData.slice(0, 7).map(item => ({
  date: item.date.substring(5), // Get only MM-DD format
  회원: item.members,
  일일권: item.dailyTickets,
})).reverse();

const Dashboard = () => {
  const [revenueTab, setRevenueTab] = useState("daily");
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gym-primary to-gym-accent bg-clip-text text-transparent">대시보드</h1>
        <p className="text-muted-foreground text-sm">최종 업데이트: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-bl-3xl flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-gym-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">오늘 매출</CardTitle>
            <CardDescription>
              {getRevenueChange('daily') >= 0 ? (
                <div className="flex items-center text-gym-success gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+{getRevenueChange('daily').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-gym-danger gap-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">{getRevenueChange('daily').toFixed(1)}%</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTodayRevenue())}
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Revenue */}
        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-bl-3xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-indigo-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">이번달 매출</CardTitle>
            <CardDescription>
              {getRevenueChange('monthly') >= 0 ? (
                <div className="flex items-center text-gym-success gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+{getRevenueChange('monthly').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-gym-danger gap-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">{getRevenueChange('monthly').toFixed(1)}%</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getMonthlyRevenue())}
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Visitors */}
        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-bl-3xl flex items-center justify-center">
            <Users className="h-6 w-6 text-purple-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">오늘 방문자</CardTitle>
            <CardDescription>
              {getVisitorChange('daily') >= 0 ? (
                <div className="flex items-center text-gym-success gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+{getVisitorChange('daily').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-gym-danger gap-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">{getVisitorChange('daily').toFixed(1)}%</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTodayVisitors()}명
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Visitors */}
        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-bl-3xl flex items-center justify-center">
            <Users className="h-6 w-6 text-pink-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">이번주 방문자</CardTitle>
            <CardDescription>
              {getVisitorChange('weekly') >= 0 ? (
                <div className="flex items-center text-gym-success gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+{getVisitorChange('weekly').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-gym-danger gap-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">{getVisitorChange('weekly').toFixed(1)}%</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getWeeklyVisitors()}명
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="col-span-1 border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b">
            <CardTitle className="text-lg font-semibold">매출 요약</CardTitle>
            <Tabs defaultValue="daily" value={revenueTab} onValueChange={setRevenueTab} className="mt-2 sm:mt-0">
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs px-3 py-1">일일</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-3 py-1">매월</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {revenueTab === "daily" ? (
                  <AreaChart
                    data={dailyRevenueData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                    <YAxis
                      tickFormatter={(value) => `${value / 10000}만원`}
                      tick={{ fontSize: 12 }}
                      width={70}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                        border: '1px solid #f0f0f0' 
                      }}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4EA8DE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4EA8DE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="매출" 
                      stroke="#4EA8DE" 
                      strokeWidth={2}
                      fill="url(#colorRevenue)" 
                      activeDot={{ r: 6, strokeWidth: 0 }} 
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                    <YAxis
                      tickFormatter={(value) => `${value / 1000000}백만원`}
                      tick={{ fontSize: 12 }}
                      width={70}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                        border: '1px solid #f0f0f0' 
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="매출"
                      stroke="#8FB4FF"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue Breakdown */}
        <Card className="col-span-1 border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden">
          <CardHeader className="border-b pb-2">
            <CardTitle className="text-lg font-semibold">매출 구성</CardTitle>
            <CardDescription>이번달 매출 카테고리별 비율</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    paddingAngle={2}
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                      border: '1px solid #f0f0f0' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Visitor Trends */}
      <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="border-b pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-lg font-semibold">방문자 추이</CardTitle>
              <CardDescription>최근 7일간 방문자 현황</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visitorData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: '1px solid #f0f0f0' 
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
                <Bar 
                  dataKey="회원" 
                  fill="#8FB4FF" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  name="회원"
                />
                <Bar 
                  dataKey="일일권" 
                  fill="#A78BFA" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={40}
                  name="일일권"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
