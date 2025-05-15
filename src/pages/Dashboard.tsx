
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { mockRevenueData, mockMonthlyRevenueData, mockVisitorsData } from "@/data/mockData";
import { TrendingUp, TrendingDown, Users, CreditCard } from "lucide-react";

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

// Colors for the pie chart
const COLORS = ['#2563eb', '#3b82f6', '#0ea5e9', '#64748b'];

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">헬스장 운영 현황을 한눈에 확인하세요.</p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">오늘 매출</CardTitle>
              <CardDescription>
                {getRevenueChange('daily') >= 0 ? (
                  <div className="flex items-center text-gym-success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+{getRevenueChange('daily').toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gym-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>{getRevenueChange('daily').toFixed(1)}%</span>
                  </div>
                )}
              </CardDescription>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTodayRevenue())}
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Revenue */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">이번달 매출</CardTitle>
              <CardDescription>
                {getRevenueChange('monthly') >= 0 ? (
                  <div className="flex items-center text-gym-success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+{getRevenueChange('monthly').toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gym-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>{getRevenueChange('monthly').toFixed(1)}%</span>
                  </div>
                )}
              </CardDescription>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getMonthlyRevenue())}
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Visitors */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">오늘 방문자</CardTitle>
              <CardDescription>
                {getVisitorChange('daily') >= 0 ? (
                  <div className="flex items-center text-gym-success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+{getVisitorChange('daily').toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gym-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>{getVisitorChange('daily').toFixed(1)}%</span>
                  </div>
                )}
              </CardDescription>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTodayVisitors()}명
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Visitors */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">이번주 방문자</CardTitle>
              <CardDescription>
                {getVisitorChange('weekly') >= 0 ? (
                  <div className="flex items-center text-gym-success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+{getVisitorChange('weekly').toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gym-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>{getVisitorChange('weekly').toFixed(1)}%</span>
                  </div>
                )}
              </CardDescription>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getWeeklyVisitors()}명
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>매출 요약</CardTitle>
            <Tabs defaultValue="daily" value={revenueTab} onValueChange={setRevenueTab}>
              <TabsList>
                <TabsTrigger value="daily">일일</TabsTrigger>
                <TabsTrigger value="monthly">매월</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {revenueTab === "daily" ? (
                  <BarChart
                    data={dailyRevenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => `${value / 10000}만원`}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Bar dataKey="매출" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => `${value / 1000000}백만원`}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Line
                      type="monotone"
                      dataKey="매출"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue Breakdown */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>매출 구성</CardTitle>
            <CardDescription>이번달 매출 카테고리별 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Visitor Trends */}
      <Card>
        <CardHeader>
          <CardTitle>방문자 추이</CardTitle>
          <CardDescription>최근 7일간 방문자 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visitorData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="회원" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="일일권" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
