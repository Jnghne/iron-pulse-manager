
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberStats } from './components/MemberStats';
import { RevenueStats } from './components/RevenueStats';
import { StaffStats } from './components/StaffStats';
import {
  currentBusiness,
  memberData,
  revenueData,
  staffData,
  memberChartConfig,
  revenueChartConfig,
  membershipTypeData
} from './data/statisticsData';

export const StatisticsDashboard = () => {
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
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-16 p-1 bg-white dark:bg-slate-800 backdrop-blur-lg border shadow-lg rounded-lg">
            <TabsTrigger value="members" className="text-sm font-medium h-12 rounded-md data-[state=active]:bg-gym-primary data-[state=active]:text-white">회원 통계</TabsTrigger>
            <TabsTrigger value="revenue" className="text-sm font-medium h-12 rounded-md data-[state=active]:bg-gym-primary data-[state=active]:text-white">매출 통계</TabsTrigger>
            <TabsTrigger value="staff" className="text-sm font-medium h-12 rounded-md data-[state=active]:bg-gym-primary data-[state=active]:text-white">직원 실적</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-8">
            <MemberStats 
              memberData={memberData}
              memberChartConfig={memberChartConfig}
              membershipTypeData={membershipTypeData}
              businessName={currentBusiness}
            />
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-8">
            <RevenueStats 
              revenueData={revenueData}
              revenueChartConfig={revenueChartConfig}
              businessName={currentBusiness}
            />
          </TabsContent>
          
          <TabsContent value="staff" className="space-y-8">
            <StaffStats staffData={staffData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
