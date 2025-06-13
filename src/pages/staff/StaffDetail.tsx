import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Edit, CheckCircle, XCircle, Users, CreditCard, BarChart3 } from "lucide-react";
import { staffMockData, registrationMockData } from "@/data/staff-mock-data";
import { StaffMembersList } from "./components/StaffMembersList";
import { ApprovalActions } from "./components/ApprovalActions";
import { StaffSummary } from "./components/StaffSummary";
import { EditStaffDialog } from "./components/dialogs/EditStaffDialog";
import { Staff, StaffRegistration } from "./types";
import { toast } from "sonner";


const StaffDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | StaffRegistration | null>(null);
  const [activeTab, setActiveTab] = useState("members");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    gender?: string;
    address?: string;
    account?: string;
    workHours?: string;
    memo?: string;
  }>({});

  useEffect(() => {
    if (id) {
      // 먼저 일반 직원에서 찾기
      const foundStaff = staffMockData.find(s => s.id === id);
      if (foundStaff) {
        setStaff(foundStaff);
        // 편집 폼 초기화
        setEditForm({
          name: foundStaff.name || '',
          email: foundStaff.email || '',
          phone: foundStaff.phone || '',
          position: foundStaff.position || '',
          gender: foundStaff.gender || '',
          address: foundStaff.address || '',
          account: foundStaff.account || '',
          workHours: foundStaff.workHours || '',
          memo: foundStaff.memo || ''
        });
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

  const handleSaveStaff = () => {
    if (!staff || !editForm.name || !editForm.phone) {
      toast.error("필수 항목(이름, 연락처)을 입력해주세요.");
      return;
    }

    // 직원 정보 업데이트 (실제 구현에서는 API 호출)
    const updatedStaff = {
      ...staff,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      position: editForm.position,
      gender: editForm.gender,
      address: editForm.address,
      account: editForm.account,
      workHours: editForm.workHours,
      memo: editForm.memo
    } as Staff;

    // staffMockData에서 해당 직원 정보도 업데이트
    const staffIndex = staffMockData.findIndex(s => s.id === staff.id);
    if (staffIndex !== -1) {
      // 기존 직원 정보를 업데이트하되, 타입 호환성을 위해 필요한 필드만 업데이트
      Object.assign(staffMockData[staffIndex], {
        name: updatedStaff.name,
        email: updatedStaff.email,
        phone: updatedStaff.phone,
        position: updatedStaff.position,
        gender: updatedStaff.gender,
        address: updatedStaff.address,
        account: updatedStaff.account,
        // workHours 속성은 Staff 타입에만 존재하므로 타입 체크 후 접근
        ...(('workHours' in updatedStaff) ? { workHours: updatedStaff.workHours } : {}),
        memo: updatedStaff.memo
      });
    }

    setStaff(updatedStaff);
    setEditDialogOpen(false);
    toast.success("직원 정보가 성공적으로 수정되었습니다.");
  };

  const handleEditDialogOpen = () => {
    // Staff 타입인지 명확하게 확인하는 타입 가드 함수
    const isStaff = (s: Staff | StaffRegistration): s is Staff => {
      return !('isRegistration' in s && s.isRegistration);
    };

    if (staff && isStaff(staff)) {
      // 현재 직원 정보로 폼 초기화
      setEditForm({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        position: staff.position || '',
        gender: staff.gender || '',
        address: staff.address || '',
        account: staff.account || '',
        workHours: staff.workHours || '',
        memo: staff.memo || ''
      });
      setEditDialogOpen(true);
    }
  };

  if (!staff) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">직원 정보를 찾을 수 없습니다</CardTitle>
            <CardDescription>
              요청하신 ID({id})에 해당하는 직원 정보가 존재하지 않습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={handleBack} className="bg-gym-primary hover:bg-gym-primary/90">
              직원 목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRegistration = 'isRegistration' in staff && staff.isRegistration;

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 및 액션 버튼 */}
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>

        
        {isRegistration ?
          /* 승인 액션 버튼 */
          <div className="flex gap-3">
            <ApprovalActions staff={staff as Staff} />
          </div> 
          : 
          /* 직원 정보 수정 버튼 */
          <Button
            onClick={handleEditDialogOpen}
            className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
            <Edit className="h-4 w-4" />
            <span>직원 정보 수정</span>
          </Button>
        }

      </div>

      {/* 직원 정보 요약 */}
      <StaffSummary staff={staff as Staff} />

      {/* 메인 콘텐츠 탭 */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger
                value="members"
                className="px-4 py-2 text-sm flex items-center gap-2"
                disabled={isRegistration}
              >
                <Users className="h-4 w-4" />
                <span>담당 회원</span>
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="px-4 py-2 text-sm flex items-center gap-2"
                disabled={isRegistration}
              >
                <BarChart3 className="h-4 w-4" />
                <span>실적 분석</span>
              </TabsTrigger>
            </TabsList>


            <TabsContent value="members" className="mt-6">
              <StaffMembersList staffId={staff.id} />
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">실적 분석</h3>
                  <p className="text-sm text-muted-foreground">월별 실적 및 회원 관리 현황을 확인할 수 있습니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          회원 수
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {(staff as Staff).memberCount || 0}명
                      </div>
                      <div className="text-sm text-muted-foreground">담당 회원 수</div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          매출
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {((staff as Staff).revenue || 0).toLocaleString()}원
                      </div>
                      <div className="text-sm text-muted-foreground">이번 달 매출</div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          평균
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {(staff as Staff).memberCount
                          ? Math.round(((staff as Staff).revenue || 0) / (staff as Staff).memberCount).toLocaleString()
                          : 0}원
                      </div>
                      <div className="text-sm text-muted-foreground">회원당 평균 매출</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 직원 정보 수정 다이얼로그 */}
      {staff && !isRegistration && (
        <EditStaffDialog
          staff={staff as Staff}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveStaff}
        />
      )}
    </div>
  );
};

export default StaffDetail;
