
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { staffMockData, registrationMockData } from "@/data/staff-mock-data";
import { StaffBasicInfo } from "./components/StaffBasicInfo";
import { StaffMembersList } from "./components/StaffMembersList";
import { ApprovalPendingInfo } from "./components/ApprovalPendingInfo";
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
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">직원 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isRegistration = 'isRegistration' in staff && staff.isRegistration;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {staff.name}
            {isRegistration && <span className="text-sm text-muted-foreground ml-2">(가입 요청)</span>}
          </h1>
          <p className="text-muted-foreground">
            {isRegistration ? '가입 요청 상세 정보' : '직원 상세 정보'}
          </p>
        </div>
      </div>

      {/* 탭과 컨텐츠 */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 h-11">
            <TabsTrigger value="info" className="text-sm">기본 정보</TabsTrigger>
            <TabsTrigger value="members" className="text-sm" disabled={isRegistration}>
              담당 회원
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-sm" disabled={isRegistration}>
              실적
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="info" className="space-y-0">
              {isRegistration ? (
                <ApprovalPendingInfo staff={staff as Staff} />
              ) : (
                <StaffBasicInfo staff={staff as Staff} onStaffUpdate={setStaff} />
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-0">
              <StaffMembersList staffId={staff.id} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-0">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">실적 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(staff as Staff).memberCount || 0}명
                    </div>
                    <div className="text-sm text-gray-600 mt-1">담당 회원 수</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {((staff as Staff).revenue || 0).toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-600 mt-1">이번 달 매출</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(staff as Staff).memberCount 
                        ? Math.round(((staff as Staff).revenue || 0) / (staff as Staff).memberCount).toLocaleString()
                        : 0}원
                    </div>
                    <div className="text-sm text-gray-600 mt-1">회원당 평균 매출</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDetail;
