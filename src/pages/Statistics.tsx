
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
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

const membershipTypeData = [
  { name: '1개월', value: 45, fill: '#FFE5E5' },
  { name: '3개월', value: 30, fill: '#E5F5FF' },
  { name: '6개월', value: 15, fill: '#E5FFE5' },
  { name: '12개월', value: 10, fill: '#FFF5E5' },
];

// Pastel colors for charts
const PASTEL_COLORS = ['#FFE5E5', '#E5F5FF', '#E5FFE5', '#FFF5E5', '#F5E5FF'];

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
            <Card>
              <CardHeader>
                <CardTitle>월별 회원 현황</CardTitle>
                <CardDescription>{currentBusiness} 회원 변화 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={memberData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="총 회원수" fill="#FFE5E5" />
                    <Bar dataKey="active" name="활성 회원" fill="#E5FFE5" />
                    <Bar dataKey="pt" name="PT 회원" fill="#FFF5E5" />
                    <Bar dataKey="inactive" name="휴면 회원" fill="#F5E5FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>회원권 유형 분포</CardTitle>
                <CardDescription>현재 등록된 회원권 유형별 현황</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={membershipTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {membershipTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}명`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>회원 요약</CardTitle>
              <CardDescription>{currentBusiness} 회원 현황 세부사항</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 border rounded-lg bg-pink-50/50">
                  <div className="text-2xl font-bold">{currentMonthData.total}</div>
                  <div className="text-sm text-muted-foreground">총 회원 수</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50/50">
                  <div className="text-2xl font-bold text-green-500">{currentMonthData.active}</div>
                  <div className="text-sm text-muted-foreground">활성 회원</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-yellow-50/50">
                  <div className="text-2xl font-bold text-yellow-500">{currentMonthData.pt}</div>
                  <div className="text-sm text-muted-foreground">PT 회원</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-red-50/50">
                  <div className="text-2xl font-bold text-red-400">{currentMonthData.inactive}</div>
                  <div className="text-sm text-muted-foreground">휴면 회원</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50/50">
                  <div className="text-2xl font-bold text-blue-500">32</div>
                  <div className="text-sm text-muted-foreground">신규 회원</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 현황</CardTitle>
              <CardDescription>{currentBusiness} 매출 변화 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                  <Legend />
                  <Bar dataKey="membership" name="회원권" fill="#FFE5E5" />
                  <Bar dataKey="pt" name="PT 이용권" fill="#E5FFE5" />
                  <Bar dataKey="daily" name="일일권" fill="#FFF5E5" />
                  <Bar dataKey="other" name="기타" fill="#F5E5FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>수입 요약 (5월)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">총 매출</div>
                    <div className="font-bold">{totalCurrentRevenue.toLocaleString()}원</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">회원권 매출</div>
                    <div className="font-bold">{currentRevenue.membership.toLocaleString()}원 ({Math.round((currentRevenue.membership / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">PT 이용권 매출</div>
                    <div className="font-bold">{currentRevenue.pt.toLocaleString()}원 ({Math.round((currentRevenue.pt / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">일일권 매출</div>
                    <div className="font-bold">{currentRevenue.daily.toLocaleString()}원 ({Math.round((currentRevenue.daily / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">기타 매출</div>
                    <div className="font-bold">{currentRevenue.other.toLocaleString()}원 ({Math.round((currentRevenue.other / totalCurrentRevenue) * 100)}%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>지출 요약 (5월)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">총 지출</div>
                    <div className="font-bold text-red-400">4,850,000원</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">인건비</div>
                    <div className="font-bold">3,200,000원 (66.0%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">임대료</div>
                    <div className="font-bold">1,000,000원 (20.6%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">수도/전기</div>
                    <div className="font-bold">350,000원 (7.2%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">기타 경비</div>
                    <div className="font-bold">300,000원 (6.2%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>직원 실적</CardTitle>
              <CardDescription>직원별 PT 수업 및 매출 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>직원명</TableHead>
                    <TableHead className="text-center">PT 수업 수</TableHead>
                    <TableHead className="text-center">매출</TableHead>
                    <TableHead className="text-center">평점</TableHead>
                    <TableHead className="text-center">신규 회원</TableHead>
                    <TableHead className="text-center">회원 유지율</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData.map((staff) => (
                    <TableRow key={staff.name}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell className="text-center">{staff.pt}회</TableCell>
                      <TableCell className="text-center font-semibold text-green-500">
                        {staff.revenue.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">
                          ⭐ {staff.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{staff.newMembers}명</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          staff.retentionRate >= 80 ? 'bg-green-100 text-green-600' : 
                          staff.retentionRate >= 75 ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-red-100 text-red-600'
                        }`}>
                          {staff.retentionRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={staff.status === '정상' ? 'default' : staff.status === '휴직' ? 'secondary' : 'destructive'}
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
