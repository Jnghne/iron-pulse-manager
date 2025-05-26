
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockMembers } from "@/data/mockData";
import { QrCode, Search, Check, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock QR scanning
const mockScanQR = (): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate scanning delay
    setTimeout(() => {
      // Randomly pick a member ID from our mock data
      const randomIndex = Math.floor(Math.random() * mockMembers.length);
      const memberId = mockMembers[randomIndex].id;
      resolve(memberId);
    }, 1500);
  });
};

const AttendanceQR = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ memberId: string; memberName: string } | null>(null);
  
  const handleScan = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      
      // In a real app, this would activate the camera and scan a QR code
      const memberId = await mockScanQR();
      const member = mockMembers.find(m => m.id === memberId);
      
      if (member) {
        setScanResult({
          memberId: member.id,
          memberName: member.name
        });
        
        toast.success(`${member.name} 회원의 출석이 확인되었습니다.`, {
          description: `회원번호: ${member.id}`,
        });
      } else {
        toast.error("등록되지 않은 회원입니다.");
      }
    } catch (error) {
      console.error("QR 스캔 오류:", error);
      toast.error("QR 코드 스캔 중 오류가 발생했습니다.");
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center">
        <div className={`w-64 h-64 border-4 rounded-lg relative overflow-hidden flex items-center justify-center ${
          isScanning ? "border-gym-primary animate-pulse" : "border-dashed border-muted-foreground"
        }`}>
          {isScanning ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-gym-primary absolute animate-[scanning_2s_ease-in-out_infinite]"></div>
              <QrCode className="w-16 h-16 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <QrCode className="w-16 h-16 mb-4" />
              <p className="text-sm">QR 코드 스캔을 시작하려면 버튼을 클릭하세요</p>
            </div>
          )}
        </div>
        
        <Button 
          className="mt-6 w-64 bg-gym-primary hover:bg-gym-primary/90" 
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? "스캔 중..." : "QR 스캔 시작"}
        </Button>
      </div>
      
      {scanResult && (
        <Card className="border-gym-success">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center text-gym-success">
              <Check className="mr-2 h-5 w-5" />
              출석 확인 완료
            </CardTitle>
            <CardDescription>
              회원의 출석이 성공적으로 기록되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">회원 이름</div>
              <div className="text-sm">{scanResult.memberName}</div>
              
              <div className="text-sm font-medium">회원 번호</div>
              <div className="text-sm">{scanResult.memberId}</div>
              
              <div className="text-sm font-medium">출석 일시</div>
              <div className="text-sm">{new Date().toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AttendanceManual = () => {
  const [memberId, setMemberId] = useState("");
  const [searchResult, setSearchResult] = useState<typeof mockMembers[0] | null>(null);
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = () => {
    if (!memberId.trim()) {
      toast.error("회원 번호를 입력해주세요.");
      return;
    }
    
    // Reset previous search
    setSearchResult(null);
    setAttendanceRecorded(false);
    
    // Search for member by ID
    const member = mockMembers.find(m => m.id === memberId);
    
    if (member) {
      setSearchResult(member);
    } else {
      toast.error("등록된 회원을 찾을 수 없습니다.");
    }
  };
  
  const handleAttendance = () => {
    if (!searchResult) return;
    
    // In a real app, this would be an API call
    toast.success(`${searchResult.name} 회원의 출석이 확인되었습니다.`, {
      description: `회원번호: ${searchResult.id}`,
    });
    
    setAttendanceRecorded(true);
    setMemberId("");
    
    // Focus the input for the next entry
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>회원 번호로 출석 체크</CardTitle>
          <CardDescription>
            회원 번호를 입력하여 출석을 체크합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="member-id" className="sr-only">
                회원 번호
              </Label>
              <Input
                id="member-id"
                ref={inputRef}
                placeholder="회원 번호 입력 (예: M123456)"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button onClick={handleSearch}>검색</Button>
          </div>
          
          {searchResult && (
            <Card className={attendanceRecorded ? "border-gym-success" : ""}>
              <CardHeader className={attendanceRecorded ? "bg-green-50" : ""}>
                <CardTitle className="flex items-center">
                  {attendanceRecorded ? (
                    <>
                      <Check className="mr-2 h-5 w-5 text-gym-success" />
                      <span className="text-gym-success">출석 확인 완료</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-5 w-5" />
                      <span>회원 정보 확인</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">회원 이름</div>
                  <div className="text-sm">{searchResult.name}</div>
                  
                  <div className="text-sm font-medium">회원 번호</div>
                  <div className="text-sm">{searchResult.id}</div>
                  
                  <div className="text-sm font-medium">연락처</div>
                  <div className="text-sm">{searchResult.phoneNumber}</div>
                  
                  <div className="text-sm font-medium">회원권 상태</div>
                  <div className="text-sm">
                    {searchResult.membershipActive ? (
                      <span className="text-gym-success">활성</span>
                    ) : (
                      <span className="text-gym-danger">만료</span>
                    )}
                  </div>
                </div>
                
                {!attendanceRecorded && (
                  <Button
                    className="w-full mt-4 bg-gym-primary hover:bg-gym-secondary"
                    onClick={handleAttendance}
                  >
                    출석 체크하기
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>출석 체크 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <p className="font-medium">QR 코드로 출석 체크하기</p>
                <p className="text-sm text-muted-foreground">
                  회원 앱에서 표시되는 QR 코드를 스캔하여 출석을 체크할 수 있습니다.
                  QR 스캔 탭으로 이동한 후 스캔 버튼을 누르고 QR 코드를 카메라에 비춰주세요.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <p className="font-medium">회원 번호로 출석 체크하기</p>
                <p className="text-sm text-muted-foreground">
                  회원 번호를 직접 입력하여 출석을 체크할 수 있습니다.
                  회원 번호 입력란에 번호를 입력하고 검색 버튼을 누른 후, 출석 체크 버튼을 클릭하세요.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Attendance = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">출석 체크</h1>
        <p className="text-muted-foreground">회원의 헬스장 방문을 기록합니다.</p>
      </div>
      
      <Tabs defaultValue="qr" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">QR 코드 스캔</TabsTrigger>
          <TabsTrigger value="manual">회원 번호 입력</TabsTrigger>
        </TabsList>
        
        <TabsContent value="qr" className="space-y-4">
          <AttendanceQR />
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <AttendanceManual />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
