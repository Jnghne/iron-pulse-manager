import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, TrendingDown, Clock, Dumbbell } from "lucide-react";
import { mockVisitorsData, mockMembers } from "@/data/mockData";
import SimpleCalendar from "@/components/SimpleCalendar";

// Get total member count
const getTotalMembers = () => {
  return mockMembers.length;
};

// Get members with expiring memberships (within 30 days)
const getExpiringMemberships = () => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return mockMembers.filter(member => {
    if (!member.expiryDate) return false;
    const expiryDate = new Date(member.expiryDate);
    return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
  }).length;
};

// Get PT members with expiring sessions (within 30 days)
const getExpiringPTMembers = () => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return mockMembers.filter(member => {
    if (!member.ptExpiryDate || !member.ptRemaining || member.ptRemaining === 0) return false;
    const ptExpiryDate = new Date(member.ptExpiryDate);
    return ptExpiryDate >= today && ptExpiryDate <= thirtyDaysFromNow;
  }).length;
};

// Function to get change percentage (mock data for now)
const getChangePercentage = (type: 'members' | 'membership' | 'pt') => {
  // Mock percentage changes
  if (type === 'members') return 8.5;
  if (type === 'membership') return -12.3;
  if (type === 'pt') return 15.7;
  return 0;
};

// Prepare visitor data for daily chart
const dailyVisitorData = mockVisitorsData.slice(0, 7).map((item) => ({
  date: item.name,
  방문자: item.total,
})).reverse();

// Prepare visitor data for weekly chart (mock monthly data)
const weeklyVisitorData = [
  { date: '1주차', 방문자: 280 },
  { date: '2주차', 방문자: 320 },
  { date: '3주차', 방문자: 290 },
  { date: '4주차', 방문자: 350 },
  { date: '5주차', 방문자: 380 },
  { date: '6주차', 방문자: 420 },
];

const TrainerDashboard = () => {
  const [visitorTab, setVisitorTab] = useState("daily");
  
  return (
    <div className="space-y-8">
      {/* 회원 통계 카드 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Members */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 회원 수</CardTitle>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {getTotalMembers()}명
            </div>
            <div className="flex items-center mt-1">
              {getChangePercentage('members') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getChangePercentage('members').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getChangePercentage('members').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">지난달 대비</span>
            </div>
          </CardHeader>
        </Card>
        
        {/* Expiring Memberships */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">만료 임박 회원권 수</CardTitle>
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {getExpiringMemberships()}명
            </div>
            <div className="flex items-center mt-1">
              {getChangePercentage('membership') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getChangePercentage('membership').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getChangePercentage('membership').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">지난달 대비</span>
            </div>
          </CardHeader>
        </Card>

        {/* Expiring PT Members */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">만료임박 PT 회원 수</CardTitle>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Dumbbell className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {getExpiringPTMembers()}명
            </div>
            <div className="flex items-center mt-1">
              {getChangePercentage('pt') >= 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{getChangePercentage('pt').toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">{getChangePercentage('pt').toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">지난달 대비</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 방문자 통계 그래프 */}
        <Card className="col-span-1 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">방문자 요약</CardTitle>
            </div>
            <Tabs defaultValue="daily" value={visitorTab} onValueChange={setVisitorTab} className="mt-2 sm:mt-0">
              <TabsList className="h-5 bg-blue-50 dark:bg-blue-950/30">
                <TabsTrigger value="daily" className="text-xs px-3 py-1 text-blue-600 dark:text-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white">일일</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs px-3 py-1 text-blue-600 dark:text-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white">주간</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {visitorTab === "daily" ? (
                  <AreaChart
                    data={dailyVisitorData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                    <YAxis
                      tickFormatter={(value) => `${value}명`}
                      tick={{ fontSize: 12 }}
                      width={50}
                    />
                    <Tooltip
                      formatter={(value) => `${value}명`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                        border: '1px solid #f0f0f0' 
                      }}
                    />
                    <defs>
                      <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4EA8DE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4EA8DE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="방문자" 
                      stroke="#4EA8DE" 
                      strokeWidth={2}
                      fill="url(#colorVisitor)" 
                      activeDot={{ r: 6, strokeWidth: 0 }} 
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={weeklyVisitorData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                    <YAxis
                      tickFormatter={(value) => `${value}명`}
                      tick={{ fontSize: 12 }}
                      width={50}
                    />
                    <Tooltip
                      formatter={(value) => `${value}명`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                        border: '1px solid #f0f0f0' 
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="방문자"
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

        {/* 캘린더 */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
          <CardContent className="pt-6">
            <SimpleCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerDashboard;
