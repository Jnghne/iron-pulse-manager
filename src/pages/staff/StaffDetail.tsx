import { useState, useEffect, memo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Users, ChevronLeft, Edit, Calendar, FileText, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { staffMockData, membersMockData, registrationMockData, Staff, Member, StaffRegistration } from "@/data/staff-mock-data";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 직원 상태 배지 컴포넌트
declare module "@/data/staff-mock-data" {
  interface Staff {
    isRegistration?: boolean;
  }
}

const StaffStatusBadge = memo<{ status: Staff['status'] }>(({ status }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">정상</Badge>;
    case 'leave':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">휴직</Badge>;
    case 'resigned':
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">퇴사</Badge>;
    default:
      return null;
  }
});

StaffStatusBadge.displayName = 'StaffStatusBadge';

// 직원 정보 수정 폼 스키마 정의
const staffFormSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  email: z.string().email({ message: "유효한 이메일을 입력해주세요" }),
  phone: z.string().min(1, { message: "연락처를 입력해주세요" }),
  position: z.string().min(1, { message: "직책을 입력해주세요" }),
  address: z.string().optional(),
  account: z.string().optional(),
  workHours: z.string().optional(),
  status: z.enum(["active", "leave", "resigned"]),
  memo: z.string().optional()
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

export const StaffDetail = memo(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // 직원 목록에서 찾기
      const foundStaff = staffMockData.find(s => s.id === id);
      
      if (foundStaff) {
        setStaff(foundStaff);
        
        // 해당 직원이 담당하는 회원 데이터 설정
        const staffMembers = membersMockData[id] || [];
        setMembers(staffMembers);
      } else {
        // 가입 요청 목록에서 찾기
        const foundRegistration = registrationMockData.find(r => r.id === id);
        
        if (foundRegistration) {
          // 가입 요청 정보를 Staff 형태로 변환
          const convertedStaff: Staff = {
            id: foundRegistration.id,
            name: foundRegistration.name,
            phone: foundRegistration.phone,
            email: foundRegistration.email,
            position: foundRegistration.position || '',
            memberCount: 0,
            status: foundRegistration.status === 'pending' ? 'active' : 'resigned',
            approvalDate: foundRegistration.registrationDate,
            address: foundRegistration.address,
            memo: foundRegistration.memo,
            // 가입 신청자임을 표시
            isRegistration: true
          };
          
          setStaff(convertedStaff);
          setMembers([]);
        }
      }
    }
  }, [id]);

  const handleBack = () => {
    navigate('/staff');
  };

  const handleApprove = useCallback(() => {
    if (staff?.isRegistration) {
      setLoading(true);
      // 여기서는 Mock 데이터만 조작하므로 실제 API 호출 대신 타임아웃 사용
      setTimeout(() => {
        // 승인 처리 로직
        const updatedStaff = { ...staff, isRegistration: false };
        setStaff(updatedStaff);
        
        // Mock 데이터 업데이트
        const index = registrationMockData.findIndex(r => r.id === staff.id);
        if (index !== -1) {
          // 등록 요청 목록에서 삭제
          registrationMockData.splice(index, 1);
          
          // 실제 직원 데이터에 추가
          staffMockData.push(updatedStaff);
        }
        
        setApproveDialogOpen(false);
        setLoading(false);
        toast.success("직원 가입이 승인되었습니다.");
        navigate('/staff');
      }, 500);
    }
  }, [staff, navigate]);

  const handleReject = useCallback(() => {
    if (staff?.isRegistration) {
      setLoading(true);
      setTimeout(() => {
        // 등록 요청 목록에서 삭제
        const index = registrationMockData.findIndex(r => r.id === staff.id);
        if (index !== -1) {
          registrationMockData.splice(index, 1);
        }
        
        setRejectDialogOpen(false);
        setLoading(false);
        toast.success("직원 가입 요청이 거절되었습니다.");
        navigate('/staff');
      }, 500);
    }
  }, [staff, navigate]);
  
  // 직원 정보 업데이트 핸들러
  const handleStaffUpdate = useCallback((data: StaffFormValues) => {
    if (staff) {
      // 직원 데이터 업데이트
      const updatedStaff = {
        ...staff,
        ...data
      };
      
      // 상태 업데이트
      setStaff(updatedStaff);
      
      // Mock 데이터 업데이트
      const index = staffMockData.findIndex(s => s.id === staff.id);
      if (index !== -1) {
        staffMockData[index] = updatedStaff;
      }
      
      toast.success("직원 정보가 성공적으로 업데이트되었습니다.");
    }
  }, [staff]);

  if (!staff) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">직원을 찾을 수 없습니다.</p>
      </div>
    );
  }

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
        
        <div className="flex gap-3">
          {staff.isRegistration ? (
            /* 가입 요청에 대한 승인/거절 버튼 */
            <>
              <Button 
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
                className="flex items-center gap-2 text-sm"
                disabled={loading}
              >
                <XCircle className="h-4 w-4" />
                <span>가입 거절</span>
              </Button>
              
              <Button 
                onClick={() => setApproveDialogOpen(true)}
                className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                <CheckCircle className="h-4 w-4" />
                <span>가입 승인</span>
              </Button>
            </>
          ) : (
            /* 일반 직원에 대한 버튼 */
            <>
              <Button 
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>근무 상태 변경</span>
              </Button>
              
              <Button 
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                <span>정보 수정</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* 메인 콘텐츠 탭 */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger value="info" className="px-4 py-2 text-sm flex items-center justify-center">
                <UserCircle className="mr-2 h-4 w-4" />
                기본 정보
              </TabsTrigger>
              <TabsTrigger value="members" className="px-4 py-2 text-sm flex items-center justify-center" disabled={members.length === 0}>
                <Users className="mr-2 h-4 w-4" />
                담당 회원 ({members.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-6">
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="px-0 py-6">
                  <div className="grid grid-cols-1 gap-6 px-6">
                    <div>
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0 bg-slate-100 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                          <UserCircle className="w-16 h-16 text-slate-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h2 className="text-2xl font-bold">{staff.name}</h2>
                            <div className="flex flex-wrap gap-2">
                              <StaffStatusBadge status={staff.status} />
                              {staff.isRegistration && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">가입 신청자</Badge>
                              )}
                              <Badge variant="outline" className="border-slate-200">{staff.position}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">이메일</p>
                          <p className="font-medium">{staff.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">연락처</p>
                          <p className="font-medium">{staff.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {staff.isRegistration ? '가입 신청일' : '가입일'}
                          </p>
                          <p className="font-medium">{staff.approvalDate}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">주소</p>
                          <p>{staff.address || '-'}</p>
                        </div>
                        
                        {!staff.isRegistration && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">계좌 정보</p>
                            <p>{staff.account || '-'}</p>
                          </div>
                        )}
                        
                        {!staff.isRegistration && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">근무 시간</p>
                            <p>{staff.workHours || '-'}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">담당 회원 수</p>
                          <p>{staff.memberCount}명</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-3 mt-4">
                      <p className="text-sm font-medium text-muted-foreground">특이사항 메모</p>
                      <div className="relative p-4 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30 mt-1 md:w-1/2">
                        <div className="flex items-start gap-2 mb-1">
                          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <p className="whitespace-pre-wrap text-sm">{staff.memo || '특이사항 메모'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="members" className="mt-6">
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent>
                  {members.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>연락처</TableHead>
                            <TableHead>멤버십 종류</TableHead>
                            <TableHead>시작일</TableHead>
                            <TableHead>종료일</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((member, index) => (
                            <TableRow key={member.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-medium">{member.name}</TableCell>
                              <TableCell>{member.phone}</TableCell>
                              <TableCell>{member.membershipType}</TableCell>
                              <TableCell>{member.startDate}</TableCell>
                              <TableCell>{member.endDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <Users className="h-10 w-10 mb-2" />
                      <p>담당 회원이 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* 승인 대화상자 */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>직원 가입 승인</AlertDialogTitle>
            <AlertDialogDescription>
              {staff.name}님의 직원 가입 요청을 승인하시겠습니까?
              승인 시 직원 목록에 추가되고 시스템에 접근할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "처리중..." : "승인하기"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 거절 대화상자 */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>직원 가입 거절</AlertDialogTitle>
            <AlertDialogDescription>
              {staff.name}님의 직원 가입 요청을 거절하시겠습니까?
              거절 시 해당 요청은 시스템에서 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              className="bg-destructive hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? "처리중..." : "거절하기"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 직원 정보 수정 다이얼로그 */}
      <StaffEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        staff={staff} 
        onSave={handleStaffUpdate} 
      />
    </div>
  );
});

StaffDetail.displayName = 'StaffDetail';

// 직원 정보 수정 다이얼로그 컴포넌트
interface StaffEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSave: (data: StaffFormValues) => void;
}

const StaffEditDialog = memo<StaffEditDialogProps>(({ open, onOpenChange, staff, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: staff?.name || '',
      email: staff?.email || '',
      phone: staff?.phone || '',
      position: staff?.position || '',
      address: staff?.address || '',
      account: staff?.account || '',
      workHours: staff?.workHours || '',
      status: staff?.status || 'active',
      memo: staff?.memo || ''
    }
  });
  
  // staff 데이터가 변경될 때마다 폼 값 업데이트
  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        position: staff.position,
        address: staff.address || '',
        account: staff.account || '',
        workHours: staff.workHours || '',
        status: staff.status,
        memo: staff.memo || ''
      });
    }
  }, [staff, form]);
  
  const onSubmit = useCallback((data: StaffFormValues) => {
    setIsSubmitting(true);
    
    // 실제 API 호출 대신 타임아웃 사용
    setTimeout(() => {
      onSave(data);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  }, [onSave, onOpenChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>직원 정보 수정</DialogTitle>
          <DialogDescription>
            직원의 정보를 수정합니다. 변경 사항을 저장하려면 하단의 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 *</FormLabel>
                    <FormControl>
                      <Input placeholder="이름을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>직책 *</FormLabel>
                    <FormControl>
                      <Input placeholder="직책을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일 *</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연락처 *</FormLabel>
                    <FormControl>
                      <Input placeholder="연락처를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>주소</FormLabel>
                    <FormControl>
                      <Input placeholder="주소를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>계좌 정보</FormLabel>
                    <FormControl>
                      <Input placeholder="계좌 정보를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>근무 시간</FormLabel>
                    <FormControl>
                      <Input placeholder="근무 시간을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>근무 상태 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="근무 상태를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">정상</SelectItem>
                        <SelectItem value="leave">휴직</SelectItem>
                        <SelectItem value="resigned">퇴사</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>특이사항 메모</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="특이사항이나 메모를 입력하세요" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장하기"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

StaffEditDialog.displayName = 'StaffEditDialog';

export default StaffDetail;
