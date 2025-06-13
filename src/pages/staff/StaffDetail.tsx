
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { staffMockData, registrationMockData } from "@/data/staff-mock-data";
import { StaffBasicInfo } from "./components/StaffBasicInfo";
import { StaffMembersList } from "./components/StaffMembersList";
import { ApprovalPendingInfo } from "./components/ApprovalPendingInfo";
import { ApprovalActions } from "./components/ApprovalActions";
import { Staff, StaffRegistration } from "./types";

const StaffDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | StaffRegistration | null>(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (id) {
      // 먼저 일반 직원에서 찾기
      const foundStaff = staffMockData.find(s => s.id === id);
      if (foundStaff) {
        setStaff(foundStaff);
      } else {
        // 가입 요청에서 찾기
        const foundRegistration = registrationMockData.find(r => r.id === id);
        if (foundRegistration) {
          setStaff({ ...foundRegistration, isRegistration: true });
        }
      }
    }
  }, [id]);

  const handleBack = () => {
    navigate('/staff');
  };

  if (!staff) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                <XCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">직원 정보를 찾을 수 없습니다</h3>
              <p className="text-sm text-muted-foreground">요청하신 직원 정보가 존재하지 않습니다.</p>
              <Button onClick={handleBack} className="mt-4">
                목록으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRegistration = 'isRegistration' in staff && staff.isRegistration;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {staff.name}
              </h1>
              {isRegistration && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    가입 요청
                  </span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {isRegistration ? '가입 요청 상세 정보 및 승인 관리' : '직원 상세 정보 및 실적 관리'}
            </p>
          </div>
          
          {/* 승인 액션 버튼 */}
          {isRegistration && (
            <ApprovalActions staff={staff as Staff} />
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="grid w-full max-w-lg grid-cols-3 h-12 bg-muted/50">
              <TabsTrigger 
                value="info" 
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                기본 정보
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm" 
                disabled={isRegistration}
              >
                담당 회원
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm" 
                disabled={isRegistration}
              >
                실적 분석
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="info" className="space-y-0">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  {isRegistration ? (
                    <ApprovalPendingInfo staff={staff as Staff} />
                  ) : (
                    <StaffBasicInfo staff={staff as Staff} onStaffUpdate={setStaff} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-0">
              <Card>
                <CardContent className="p-6">
                  <StaffMembersList staffId={staff.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-0">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">실적 분석</h3>
                      <p className="text-sm text-muted-foreground">월별 실적 및 회원 관리 현황을 확인할 수 있습니다.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            회원 수
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 mb-1">
                          {(staff as Staff).memberCount || 0}명
                        </div>
                        <div className="text-sm text-blue-600">담당 회원 수</div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <span className="text-white font-bold text-sm">₩</span>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            매출
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 mb-1">
                          {((staff as Staff).revenue || 0).toLocaleString()}원
                        </div>
                        <div className="text-sm text-green-600">이번 달 매출</div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <span className="text-white font-bold text-sm">AVG</span>
                          </div>
                          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            평균
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 mb-1">
                          {(staff as Staff).memberCount 
                            ? Math.round(((staff as Staff).revenue || 0) / (staff as Staff).memberCount).toLocaleString()
                            : 0}원
                        </div>
                        <div className="text-sm text-purple-600">회원당 평균 매출</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDetail;
