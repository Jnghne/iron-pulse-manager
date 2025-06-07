import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for demonstration
const memberData = [
  { name: '본점', total: 120, active: 90, pt: 45, inactive: 30 },
  { name: '강남점', total: 85, active: 70, pt: 30, inactive: 15 },
  { name: '홍대점', total: 65, active: 50, pt: 20, inactive: 15 },
];

const revenueData = [
  { month: '1월', membership: 3200000, pt: 1800000, daily: 450000, other: 200000 },
  { month: '2월', membership: 3500000, pt: 2100000, daily: 480000, other: 250000 },
  { month: '3월', membership: 3700000, pt: 2300000, daily: 510000, other: 300000 },
  { month: '4월', membership: 3200000, pt: 2000000, daily: 470000, other: 270000 },
  { month: '5월', membership: 3900000, pt: 2400000, daily: 550000, other: 320000 },
];

const trainerData = [
  { name: '김트레이너', pt: 45, revenue: 4500000, rating: 4.8, newMembers: 12, retentionRate: 85 },
  { name: '이트레이너', pt: 38, revenue: 3800000, rating: 4.6, newMembers: 9, retentionRate: 78 },
  { name: '박트레이너', pt: 30, revenue: 3000000, rating: 4.7, newMembers: 8, retentionRate: 82 },
  { name: '최트레이너', pt: 25, revenue: 2500000, rating: 4.5, newMembers: 6, retentionRate: 75 },
];

const membershipTypeData = [
  { name: '1개월', value: 45 },
  { name: '3개월', value: 30 },
  { name: '6개월', value: 15 },
  { name: '12개월', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Statistics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">통계</h1>
          <p className="text-muted-foreground">헬스장의 회원 및 매출 통계를 확인합니다.</p>
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="지점 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 지점</SelectItem>
            <SelectItem value="main">본점</SelectItem>
            <SelectItem value="gangnam">강남점</SelectItem>
            <SelectItem value="hongdae">홍대점</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">회원 현황</TabsTrigger>
          <TabsTrigger value="revenue">매출 현황</TabsTrigger>
          <TabsTrigger value="trainers">트레이너 실적</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>회원 현황</CardTitle>
              <CardDescription>지점별 회원 현황을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="총 회원수" fill="#6366F1" />
                  <Bar dataKey="active" name="활성 회원" fill="#22C55E" />
                  <Bar dataKey="pt" name="PT 회원" fill="#EAB308" />
                  <Bar dataKey="inactive" name="휴면 회원" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>회원권 유형</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={250}>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}명`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>회원 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">총 회원 수</div>
                    <div className="font-bold">270명</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">활성 회원</div>
                    <div className="font-bold text-green-600">210명 (77.8%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">PT 이용 회원</div>
                    <div className="font-bold text-yellow-600">95명 (35.2%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">휴면 회원</div>
                    <div className="font-bold text-red-600">60명 (22.2%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">이번 달 신규 회원</div>
                    <div className="font-bold text-blue-600">32명</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                  <Legend />
                  <Bar dataKey="membership" name="회원권" fill="#6366F1" />
                  <Bar dataKey="pt" name="PT 이용권" fill="#22C55E" />
                  <Bar dataKey="daily" name="일일권" fill="#EAB308" />
                  <Bar dataKey="other" name="기타" fill="#8884d8" />
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
                    <div className="font-bold">7,170,000원</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">회원권 매출</div>
                    <div className="font-bold">3,900,000원 (54.4%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">PT 이용권 매출</div>
                    <div className="font-bold">2,400,000원 (33.5%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">일일권 매출</div>
                    <div className="font-bold">550,000원 (7.7%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">기타 매출</div>
                    <div className="font-bold">320,000원 (4.5%)</div>
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
                    <div className="font-bold text-red-600">4,850,000원</div>
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
        
        <TabsContent value="trainers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>트레이너 실적</CardTitle>
              <CardDescription>트레이너별 PT 수업 및 매출 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>트레이너명</TableHead>
                    <TableHead className="text-center">PT 수업 수</TableHead>
                    <TableHead className="text-center">매출</TableHead>
                    <TableHead className="text-center">평점</TableHead>
                    <TableHead className="text-center">신규 회원</TableHead>
                    <TableHead className="text-center">회원 유지율</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainerData.map((trainer) => (
                    <TableRow key={trainer.name}>
                      <TableCell className="font-medium">{trainer.name}</TableCell>
                      <TableCell className="text-center">{trainer.pt}회</TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {trainer.revenue.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          ⭐ {trainer.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{trainer.newMembers}명</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          trainer.retentionRate >= 80 ? 'bg-green-100 text-green-800' : 
                          trainer.retentionRate >= 75 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {trainer.retentionRate}%
                        </span>
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
