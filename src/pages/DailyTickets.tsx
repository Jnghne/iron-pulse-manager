
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/DatePicker";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

// Mock data for daily tickets
interface DailyTicket {
  id: string;
  name: string;
  phoneNumber: string;
  date: string;
  visitTime?: string; // 방문 시간 추가
  paymentAmount: number;
  paymentMethod: "카드" | "현금" | "계좌이체";
}

const mockDailyTickets: DailyTicket[] = [
  {
    id: "D100001",
    name: "김방문",
    phoneNumber: "010-1234-5678",
    date: new Date().toISOString().split("T")[0],
    visitTime: "09:30",
    paymentAmount: 10000,
    paymentMethod: "카드"
  },
  {
    id: "D100002",
    name: "박일일",
    phoneNumber: "010-2345-6789",
    date: new Date().toISOString().split("T")[0],
    visitTime: "14:15",
    paymentAmount: 10000,
    paymentMethod: "현금"
  },
  {
    id: "D100003",
    name: "이헬스",
    phoneNumber: "010-3456-7890",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    visitTime: "18:45",
    paymentAmount: 10000,
    paymentMethod: "카드"
  },
  {
    id: "D100004",
    name: "최운동",
    phoneNumber: "010-4567-8901",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    visitTime: "11:20",
    paymentAmount: 10000,
    paymentMethod: "계좌이체"
  }
];

// Helper functions
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatDateTime = (dateStr: string, timeStr?: string): string => {
  const formattedDate = formatDate(dateStr);
  return timeStr ? `${formattedDate} ${timeStr}` : formattedDate;
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString() + "원";
};

const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber; // Already formatted in mock data
};

const DailyTickets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredTickets, setFilteredTickets] = useState<DailyTicket[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    name: "",
    phoneNumber: "",
    visitDate: new Date().toISOString().split("T")[0], // 오늘 날짜로 기본 설정
    visitTime: new Date().toTimeString().slice(0,5), // 현재 시간으로 기본 설정
    paymentAmount: 10000,
    paymentMethod: "카드"
  });
  
  // Filter tickets based on search query and date
  useEffect(() => {
    let filtered = [...mockDailyTickets];
    
    // Filter by date if "today" or "date" tab is active
    if (activeTab === "today") {
      const todayStr = new Date().toISOString().split("T")[0];
      filtered = filtered.filter(ticket => ticket.date === todayStr);
    } else if (activeTab === "date") {
      const dateStr = selectedDate.toISOString().split("T")[0];
      filtered = filtered.filter(ticket => ticket.date === dateStr);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ticket =>
          ticket.name.toLowerCase().includes(lowercaseQuery) ||
          ticket.phoneNumber.replace(/-/g, "").includes(lowercaseQuery.replace(/-/g, ""))
      );
    }
    
    setFilteredTickets(filtered);
  }, [searchQuery, selectedDate, activeTab]);
  
  const handleCreateTicket = () => {
    // Basic validation
    if (!newTicket.name || !newTicket.phoneNumber || !newTicket.visitDate || !newTicket.visitTime) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }
    
    // In a real app, this would be an API call
    const ticketId = `D${Date.now().toString().slice(-6)}`;
    
    // Add new ticket
    const ticket: DailyTicket = {
      id: ticketId,
      name: newTicket.name,
      phoneNumber: newTicket.phoneNumber,
      date: newTicket.visitDate,
      visitTime: newTicket.visitTime,
      paymentAmount: newTicket.paymentAmount,
      paymentMethod: newTicket.paymentMethod as "카드" | "현금" | "계좌이체"
    };
    
    // In a real app, this would update the server
    // For demo, we just show a success message
    toast.success(`${newTicket.name}님이 일일권으로 등록되었습니다.`);
    
    // Reset form and close dialog
    setNewTicket({
      name: "",
      phoneNumber: "",
      visitDate: new Date().toISOString().split("T")[0],
      visitTime: new Date().toTimeString().slice(0,5),
      paymentAmount: 10000,
      paymentMethod: "카드"
    });
    setIsCreateDialogOpen(false);
    
    // We'd normally refresh the data here in a real app
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end sm:items-center space-y-2 sm:space-y-0">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-gym-primary hover:bg-gym-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              일일권 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>일일권 등록</DialogTitle>
              <DialogDescription>
                일일권 사용자 정보를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visitor-name" className="text-right">
                  이름
                </Label>
                <Input
                  id="visitor-name"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visitor-phone" className="text-right">
                  연락처
                </Label>
                <Input
                  id="visitor-phone"
                  value={newTicket.phoneNumber}
                  onChange={(e) => setNewTicket({ ...newTicket, phoneNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visit-date" className="text-right">
                  방문일자
                </Label>
                <Input
                  id="visit-date"
                  type="date"
                  value={newTicket.visitDate}
                  onChange={(e) => setNewTicket({ ...newTicket, visitDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visit-time" className="text-right">
                  방문시간
                </Label>
                <Input
                  id="visit-time"
                  type="time"
                  value={newTicket.visitTime}
                  onChange={(e) => setNewTicket({ ...newTicket, visitTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-amount" className="text-right">
                  결제 금액
                </Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={newTicket.paymentAmount}
                  onChange={(e) => setNewTicket({ ...newTicket, paymentAmount: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">결제 수단</Label>
                <div className="col-span-3 flex gap-4 flex-wrap">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-card"
                      name="payment-method"
                      checked={newTicket.paymentMethod === "카드"}
                      onChange={() => setNewTicket({ ...newTicket, paymentMethod: "카드" })}
                      className="mr-2"
                    />
                    <label htmlFor="payment-card">카드</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-cash"
                      name="payment-method"
                      checked={newTicket.paymentMethod === "현금"}
                      onChange={() => setNewTicket({ ...newTicket, paymentMethod: "현금" })}
                      className="mr-2"
                    />
                    <label htmlFor="payment-cash">현금</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-transfer"
                      name="payment-method"
                      checked={newTicket.paymentMethod === "계좌이체"}
                      onChange={() => setNewTicket({ ...newTicket, paymentMethod: "계좌이체" })}
                      className="mr-2"
                    />
                    <label htmlFor="payment-transfer">계좌이체</label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateTicket} className="bg-gym-primary hover:bg-gym-primary/90">등록하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="today">오늘</TabsTrigger>
                <TabsTrigger value="date">날짜 선택</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {activeTab === "date" && (
              <div className="w-full sm:w-48">
                <DatePicker
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
            )}
            
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름 또는 연락처로 검색..."
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
                    <TableHead>방문일시</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>결제금액</TableHead>
                    <TableHead>결제방식</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket, index) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{formatDateTime(ticket.date, ticket.visitTime)}</TableCell>
                        <TableCell>{ticket.name}</TableCell>
                        <TableCell>{formatPhoneNumber(ticket.phoneNumber)}</TableCell>
                        <TableCell>{formatCurrency(ticket.paymentAmount)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={ticket.paymentMethod === "카드" ? "default" : "outline"}
                            className={
                              ticket.paymentMethod === "카드" 
                                ? "bg-gym-primary hover:bg-gym-primary/90" 
                                : ticket.paymentMethod === "현금"
                                ? "border-orange-500 text-orange-700 hover:bg-orange-50"
                                : "border-blue-500 text-blue-700 hover:bg-blue-50"
                            }
                          >
                            {ticket.paymentMethod}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2" />
                          <p>검색 결과가 없습니다.</p>
                          <p className="text-sm">다른 검색어를 입력하거나 필터를 변경해 보세요.</p>
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
    </div>
  );
};

export default DailyTickets;
