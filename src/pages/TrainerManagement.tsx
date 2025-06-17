
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search, Edit, Eye } from "lucide-react";

// Mock data for trainers
const trainersMock = [
  {
    id: "TR001",
    name: "김트레이너",
    phone: "010-1234-5678",
    email: "kim@gym.com",
    address: "서울시 강남구",
    account: "국민은행 123-456-78910",
    workHours: "09:00-18:00",
    ptMemberCount: 20,
    revenue: 4500000
  },
  {
    id: "TR002",
    name: "이트레이너",
    phone: "010-2345-6789",
    email: "lee@gym.com",
    address: "서울시 서초구",
    account: "신한은행 123-456-78910",
    workHours: "12:00-21:00",
    ptMemberCount: 15,
    revenue: 3800000
  },
  {
    id: "TR003",
    name: "박트레이너",
    phone: "010-3456-7890",
    email: "park@gym.com",
    address: "서울시 송파구",
    account: "우리은행 123-456-78910",
    workHours: "06:00-15:00",
    ptMemberCount: 18,
    revenue: 3200000
  }
];

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState(trainersMock);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    account: "",
    workHours: ""
  });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("info");

  const handleCreateTrainer = () => {
    // Basic validation
    if (!newTrainer.name || !newTrainer.phone || !newTrainer.email) {
      alert("이름, 연락처, 이메일은 필수 입력항목입니다.");
      return;
    }
    
    // In a real app, this would be an API call
    const trainerId = `TR${String(trainers.length + 1).padStart(3, '0')}`;
    
    const trainer = {
      id: trainerId,
      ...newTrainer,
      ptMemberCount: 0,
      revenue: 0
    };
    
    setTrainers([...trainers, trainer]);
    
    // Reset form and close dialog
    setNewTrainer({
      name: "",
      phone: "",
      email: "",
      address: "",
      account: "",
      workHours: ""
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewDetails = (trainer: any) => {
    setSelectedTrainer(trainer);
    setDetailDialogOpen(true);
  };

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.includes(searchQuery) || 
    trainer.id.includes(searchQuery) ||
    trainer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">트레이너 관리</h1>
          <p className="text-muted-foreground">트레이너를 등록하고 관리하며 실적을 확인합니다.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              트레이너 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>트레이너 등록</DialogTitle>
              <DialogDescription>
                트레이너 정보를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-name" className="text-right">
                  이름
                </Label>
                <Input
                  id="trainer-name"
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-phone" className="text-right">
                  연락처
                </Label>
                <Input
                  id="trainer-phone"
                  value={newTrainer.phone}
                  onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="trainer-email"
                  type="email"
                  value={newTrainer.email}
                  onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-address" className="text-right">
                  주소
                </Label>
                <Input
                  id="trainer-address"
                  value={newTrainer.address}
                  onChange={(e) => setNewTrainer({ ...newTrainer, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-account" className="text-right">
                  계좌번호
                </Label>
                <Input
                  id="trainer-account"
                  value={newTrainer.account}
                  onChange={(e) => setNewTrainer({ ...newTrainer, account: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-hours" className="text-right">
                  근무시간
                </Label>
                <Input
                  id="trainer-hours"
                  value={newTrainer.workHours}
                  onChange={(e) => setNewTrainer({ ...newTrainer, workHours: e.target.value })}
                  placeholder="예: 09:00-18:00"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateTrainer}>등록하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>트레이너 목록</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름 또는 아이디 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>아이디</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>담당 회원 수</TableHead>
                    <TableHead>이번 달 매출</TableHead>
                    <TableHead>근무 시간</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer, index) => (
                      <TableRow key={trainer.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{trainer.id}</TableCell>
                        <TableCell className="font-medium">{trainer.name}</TableCell>
                        <TableCell>{trainer.phone}</TableCell>
                        <TableCell>{trainer.ptMemberCount}명</TableCell>
                        <TableCell>{trainer.revenue.toLocaleString()}원</TableCell>
                        <TableCell>{trainer.workHours}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(trainer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2" />
                          <p>검색 결과가 없습니다.</p>
                          <p className="text-sm">다른 검색어를 입력하거나 트레이너를 추가해 보세요.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trainer Details Dialog */}
      {selectedTrainer && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>트레이너 상세 정보</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">기본 정보</TabsTrigger>
                <TabsTrigger value="members">담당 회원</TabsTrigger>
                <TabsTrigger value="performance">실적</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">이름</div>
                  <div className="col-span-2">{selectedTrainer.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">ID</div>
                  <div className="col-span-2">{selectedTrainer.id}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">연락처</div>
                  <div className="col-span-2">{selectedTrainer.phone}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">이메일</div>
                  <div className="col-span-2">{selectedTrainer.email}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">주소</div>
                  <div className="col-span-2">{selectedTrainer.address}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">계좌번호</div>
                  <div className="col-span-2">{selectedTrainer.account}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">근무 시간</div>
                  <div className="col-span-2">{selectedTrainer.workHours}</div>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="pt-4">
                <div className="text-center py-8 text-muted-foreground">
                  {selectedTrainer.name} 트레이너는 현재 {selectedTrainer.ptMemberCount}명의 회원을 담당하고 있습니다.
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-right">이번 달 매출</div>
                    <div className="col-span-2 font-bold">{selectedTrainer.revenue.toLocaleString()}원</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-right">개인레슨 회원 수</div>
                    <div className="col-span-2">{selectedTrainer.ptMemberCount}명</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-right">회원당 평균 수익</div>
                    <div className="col-span-2">
                      {selectedTrainer.ptMemberCount ? 
                        Math.round(selectedTrainer.revenue / selectedTrainer.ptMemberCount).toLocaleString() : 0}원
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TrainerManagement;
