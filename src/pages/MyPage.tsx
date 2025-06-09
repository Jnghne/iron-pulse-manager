
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, Plus, Trash2, Edit } from "lucide-react";
import GymSelectionDialog from "@/components/GymSelectionDialog";
import OwnerGymAddDialog from "@/components/OwnerGymAddDialog";

const MyPage = () => {
  const userRole = localStorage.getItem("userRole") || "trainer";
  const userEmail = localStorage.getItem("userEmail") || "test@test.com";
  const selectedGymName = localStorage.getItem("selectedGymName") || "강남 피트니스 센터";
  
  // Mock user data
  const [userInfo, setUserInfo] = useState({
    name: userRole === "owner" ? "김관장" : "이트레이너",
    email: userEmail,
    phone: "010-1234-5678",
    position: userRole === "owner" ? "대표" : "트레이너"
  });
  
  // Mock user's gym affiliations
  const [affiliatedGyms, setAffiliatedGyms] = useState([
    { id: "seoul-gangnam", name: "강남 피트니스 센터", role: "owner", status: "active" },
    { id: "seoul-hongdae", name: "홍대 스포츠 클럽", role: "trainer", status: "active" },
    { id: "busan-haeundae", name: "해운대 헬스 파크", role: "trainer", status: "pending" }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showGymAddDialog, setShowGymAddDialog] = useState(false);
  const [showOwnerGymAddDialog, setShowOwnerGymAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "프로필 업데이트 완료",
        description: "개인정보가 성공적으로 업데이트되었습니다."
      });
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleGymAdd = (gymId: string, gymName: string) => {
    const newGym = {
      id: gymId,
      name: gymName,
      role: "trainer" as const,
      status: "pending" as const
    };
    
    setAffiliatedGyms(prev => [...prev, newGym]);
    toast({
      title: "사업장 추가 요청",
      description: `${gymName}에 소속 요청이 전송되었습니다. 승인을 기다려주세요.`
    });
  };

  const handleOwnerGymAdd = (gymId: string, gymName: string) => {
    const newGym = {
      id: gymId,
      name: gymName,
      role: "owner" as const,
      status: "active" as const
    };
    
    setAffiliatedGyms(prev => [...prev, newGym]);
  };

  const handleGymRemove = (gymId: string) => {
    setAffiliatedGyms(prev => prev.filter(gym => gym.id !== gymId));
    toast({
      title: "사업장 제거",
      description: "사업장 소속이 해제되었습니다."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">승인대기</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">정지</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-blue-100 text-blue-800">관장</Badge>;
      case "trainer":
        return <Badge className="bg-purple-100 text-purple-800">트레이너</Badge>;
      default:
        return <Badge variant="outline">일반</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <div className="text-sm text-muted-foreground">
          현재 접속: <span className="font-medium">{selectedGymName}</span>
        </div>
      </div>

      {/* 트레이너는 내 정보 탭만, 사장님은 두 탭 모두 표시 */}
      {userRole === "owner" ? (
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">내 정보</TabsTrigger>
            <TabsTrigger value="gyms">사업장 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  개인정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={userInfo.name} />
                    <AvatarFallback className="bg-gym-primary text-white text-xl">
                      {userInfo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                    <p className="text-muted-foreground">{userInfo.position}</p>
                    {getRoleBadge(userRole)}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">직책</Label>
                    <Input
                      id="position"
                      value={userInfo.position}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, position: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      수정하기
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleProfileUpdate} disabled={isLoading}>
                        {isLoading ? "저장 중..." : "저장"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gyms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    소속 사업장
                  </CardTitle>
                  <Button onClick={() => setShowOwnerGymAddDialog(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    사업장 추가 (사업자번호)
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {affiliatedGyms.map((gym) => (
                    <div key={gym.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Building className="h-8 w-8 text-gym-primary" />
                        <div>
                          <h3 className="font-semibold">{gym.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getRoleBadge(gym.role)}
                            {getStatusBadge(gym.status)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGymRemove(gym.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // 트레이너는 내 정보만 표시
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              개인정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={userInfo.name} />
                <AvatarFallback className="bg-gym-primary text-white text-xl">
                  {userInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                <p className="text-muted-foreground">{userInfo.position}</p>
                {getRoleBadge(userRole)}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">직책</Label>
                <Input
                  id="position"
                  value={userInfo.position}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, position: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  수정하기
                </Button>
              ) : (
                <>
                  <Button onClick={handleProfileUpdate} disabled={isLoading}>
                    {isLoading ? "저장 중..." : "저장"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    취소
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사장님용 사업장 추가 다이얼로그 */}
      <OwnerGymAddDialog
        open={showOwnerGymAddDialog}
        onClose={() => setShowOwnerGymAddDialog(false)}
        onGymAdd={handleOwnerGymAdd}
      />
    </div>
  );
};

export default MyPage;
