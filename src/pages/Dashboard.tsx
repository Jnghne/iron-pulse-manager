
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
    const today = mockVisitorsData[0]?.total || 0;
    const yesterday = mockVisitorsData[1]?.total || 0;
    if (yesterday === 0) return 0;
    return ((today - yesterday) / yesterday) * 100;
  } else {
    const thisWeek = mockVisitorsData.slice(0, 4).reduce((sum, day) => sum + day.total, 0);
    const lastWeekData = [
      { total: 35 }, { total: 41 }, { total: 38 }, { total: 44 } // Mock last week data
    ];
    const lastWeek = lastWeekData.reduce((sum, day) => sum + day.total, 0);
    if (lastWeek === 0) return 0;
    return ((thisWeek - lastWeek) / lastWeek) * 100;
  }
};

// Prepare revenue breakdown data for pie chart
const revenueBreakdownData = [
  { name: '회원권', value: mockMonthlyRevenueData[0].membership },
  { name: '개인레슨 이용권', value: mockMonthlyRevenueData[0].lesson },
  { name: '일일권', value: mockMonthlyRevenueData[0].dailyTicket },
  { name: '기타', value: mockMonthlyRevenueData[0].other },
];

// Colors for the charts
const COLORS = ['#4EA8DE', '#8FB4FF', '#A78BFA', '#FB7185'];

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

// Prepare visitor data for the last 7 days with daily ticket data
const visitorData = mockVisitorsData.slice(0, 7).map((item) => ({
  date: item.name,
  회원: Math.floor(item.total * 0.8), // 80% are members
  일일권: Math.floor(item.total * 0.2), // 20% are daily ticket users
})).reverse();

const Dashboard = () => {
  const [revenueTab, setRevenueTab] = useState("daily");
  
  return (
    <div className="space-y-8">
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">오늘 매출</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(getTodayRevenue())}
            </div>
            <div className="flex items-center mt-1">
              {getRevenueChange('daily') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getRevenueChange('daily').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getRevenueChange('daily').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">어제 대비</span>
            </div>
          </CardHeader>
        </Card>
        
        {/* Monthly Revenue */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">이번달 매출</CardTitle>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(getMonthlyRevenue())}
            </div>
            <div className="flex items-center mt-1">
              {getRevenueChange('monthly') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getRevenueChange('monthly').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getRevenueChange('monthly').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">지난달 대비</span>
            </div>
          </CardHeader>
        </Card>
        
        {/* Today's Visitors */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">오늘 방문자</CardTitle>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {getTodayVisitors()}명
            </div>
            <div className="flex items-center mt-1">
              {getVisitorChange('daily') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getVisitorChange('daily').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getVisitorChange('daily').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">어제 대비</span>
            </div>
          </CardHeader>
        </Card>
        
        {/* Weekly Visitors */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">이번주 방문자</CardTitle>
              <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {getWeeklyVisitors()}명
            </div>
            <div className="flex items-center mt-1">
              {getVisitorChange('weekly') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getVisitorChange('weekly').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getVisitorChange('weekly').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">지난주 대비</span>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="col-span-1 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">매출 요약</CardTitle>
            </div>
            <Tabs defaultValue="daily" value={revenueTab} onValueChange={setRevenueTab} className="mt-2 sm:mt-0">
              <TabsList className="h-5 bg-blue-50 dark:bg-blue-950/30">
                <TabsTrigger value="daily" className="text-xs px-3 py-1 text-blue-600 dark:text-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white">일일</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-3 py-1 text-blue-600 dark:text-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white">매월</TabsTrigger>
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
        <Card className="col-span-1 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">매출 구성</CardTitle>
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
                    {revenueBreakdownData.map((_, index) => (
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
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">방문자 추이</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">최근 7일간 방문자 현황 (회원 및 일일권)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visitorData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barGap={1}
                barCategoryGap="20%"
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
                  fill="#3b82f6" 
                  radius={[2, 2, 0, 0]}
                  maxBarSize={32}
                  name="회원"
                />
                <Bar 
                  dataKey="일일권" 
                  fill="#8b5cf6" 
                  radius={[2, 2, 0, 0]} 
                  maxBarSize={32}
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
