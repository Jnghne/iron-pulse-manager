
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CreditCard, AlertTriangle, Eye } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

interface PaymentRecord {
  id: string;
  date: string;
  paymentDate: string;
  product: '개인레슨 이용권' | '헬스장 이용권' | '락커 이용권' | '기타 상품';
  type: '신규' | '연장';
  productName: string;
  startDate: string;
  endDate: string;
  amount: number;
  actualAmount: number;
  unpaidAmount?: number;
  paymentMethod: '카드' | '현금' | '계좌이체' | '기타';
  installment?: string;
  status: '완료' | '실패' | '대기' | '취소';
  staff?: string;
  trainer?: string;
  lockerNumber?: string;
  memo?: string;
}

interface SuspensionRecord {
  id: string;
  date: string;
  duration: number;
  reason: string;
  approver: string;
}

interface PaymentHistoryTabProps {
  memberId: string;
  onViewDetail: (payment: PaymentRecord) => void;
  isOwner: boolean;
}

export const PaymentHistoryTab = ({ memberId, onViewDetail, isOwner }: PaymentHistoryTabProps) => {
  const [activeTab, setActiveTab] = useState<string>("payment");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  
  // Mock 결제 내역 데이터
  const mockPayments: PaymentRecord[] = [
    {
      id: "P001",
      date: "2024-03-15",
      paymentDate: "2024-03-15",
      product: "개인레슨 이용권",
      type: "신규",
      productName: "개인레슨 20회권",
      startDate: "2024-03-15",
      endDate: "2024-09-15",
      amount: 1000000,
      actualAmount: 1000000,
      paymentMethod: "카드",
      installment: "일시불",
      status: "완료",
      staff: "관리자",
      trainer: "박지훈"
    },
    {
      id: "P002",
      date: "2024-02-01",
      paymentDate: "2024-02-01",
      product: "헬스장 이용권",
      type: "연장",
      productName: "헬스장 3개월권",
      startDate: "2024-02-01",
      endDate: "2024-05-01",
      amount: 300000,
      actualAmount: 300000,
      paymentMethod: "현금",
      status: "완료",
      staff: "관리자"
    },
    {
      id: "P003",
      date: "2024-01-15",
      paymentDate: "2024-01-15",
      product: "개인레슨 이용권",
      type: "연장",
      productName: "개인레슨 10회권",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      amount: 500000,
      actualAmount: 450000,
      unpaidAmount: 50000,
      paymentMethod: "계좌이체",
      status: "완료",
      staff: "김지원",
      trainer: "박지훈"
    },
    {
      id: "P004",
      date: "2023-12-10",
      paymentDate: "2023-12-10",
      product: "락커 이용권",
      type: "신규",
      productName: "락커 6개월권",
      startDate: "2023-12-10",
      endDate: "2024-06-10",
      amount: 150000,
      actualAmount: 150000,
      paymentMethod: "카드",
      status: "완료",
      staff: "관리자",
      lockerNumber: "A-01"
    },
    {
      id: "P005",
      date: "2023-11-05",
      paymentDate: "2023-11-05",
      product: "기타 상품",
      type: "신규",
      productName: "운동복 세트",
      startDate: "2023-11-05",
      endDate: "2023-11-05",
      amount: 80000,
      actualAmount: 80000,
      paymentMethod: "카드",
      status: "완료",
      staff: "김지원"
    },
    {
      id: "P006",
      date: "2023-10-20",
      paymentDate: "2023-10-20",
      product: "헬스장 이용권",
      type: "연장",
      productName: "헬스장 1개월권",
      startDate: "2023-10-20",
      endDate: "2023-11-20",
      amount: 100000,
      actualAmount: 100000,
      paymentMethod: "현금",
      status: "취소",
      staff: "관리자",
      memo: "회원 요청으로 취소 처리"
    }
  ];
  
  // Mock 정지 기록 데이터
  const mockSuspensions: SuspensionRecord[] = [
    {
      id: "S001",
      date: "2024-02-15",
      duration: 7,
      reason: "개인 사정으로 인한 일시 정지 요청",
      approver: "관리자"
    },
    {
      id: "S002",
      date: "2023-11-10",
      duration: 14,
      reason: "해외 출장으로 인한 일시 정지",
      approver: "관리자"
    }
  ];
  
  // 페이지네이션 처리
  const getPageItems = (items: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const totalPaymentPages = Math.ceil(mockPayments.length / itemsPerPage);
  const totalSuspensionPages = Math.ceil(mockSuspensions.length / itemsPerPage);
  const totalPages = activeTab === "payment" ? totalPaymentPages : totalSuspensionPages;
  
  const currentPayments = getPageItems(mockPayments, currentPage);
  const currentSuspensions = getPageItems(mockSuspensions, currentPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '완료':
        return <Badge className="bg-green-100 text-green-800">완료</Badge>;
      case '실패':
        return <Badge className="bg-red-100 text-red-800">실패</Badge>;
      case '대기':
        return <Badge className="bg-yellow-100 text-yellow-800">대기</Badge>;
      case '취소':
        return <Badge className="bg-gray-100 text-gray-800">취소</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProductBadge = (product: string) => {
    switch (product) {
      case '개인레슨 이용권':
        return <Badge className="bg-blue-100 text-blue-800">개인레슨</Badge>;
      case '헬스장 이용권':
        return <Badge className="bg-purple-100 text-purple-800">헬스장</Badge>;
      case '락커 이용권':
        return <Badge className="bg-indigo-100 text-indigo-800">락커</Badge>;
      case '기타 상품':
        return <Badge className="bg-pink-100 text-pink-800">기타</Badge>;
      default:
        return <Badge variant="outline">{product}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case '신규':
        return <Badge className="bg-emerald-100 text-emerald-800">신규</Badge>;
      case '연장':
        return <Badge className="bg-orange-100 text-orange-800">연장</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentPage(1); }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            결제 내역
          </TabsTrigger>
          <TabsTrigger value="suspension" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            정지 기록
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment" className="mt-6">
          {/* 결제 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(mockPayments.reduce((sum, payment) => sum + payment.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">총 결제 금액</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockPayments.length}</div>
                  <p className="text-sm text-muted-foreground">총 결제 건수</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {mockPayments.filter(p => p.status === '완료').length}
                  </div>
                  <p className="text-sm text-muted-foreground">완료된 결제</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 결제 내역 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제일</TableHead>
                    <TableHead>상품 시작일</TableHead>
                    <TableHead>상품 구분</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>결제 금액</TableHead>
                    <TableHead>결제 상태</TableHead>
                    <TableHead className="text-right">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPayments.map((payment) => (
                    <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={() => onViewDetail(payment)}>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell onClick={() => onViewDetail(payment)}>{formatDate(payment.startDate)}</TableCell>
                      <TableCell onClick={() => onViewDetail(payment)}>{getProductBadge(payment.product)}</TableCell>
                      <TableCell className="font-medium" onClick={() => onViewDetail(payment)}>{payment.productName}</TableCell>
                      <TableCell className="font-semibold" onClick={() => onViewDetail(payment)}>{formatCurrency(payment.actualAmount)}</TableCell>
                      <TableCell onClick={() => onViewDetail(payment)}>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewDetail(payment)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">상세 보기</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {mockPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        결제 내역이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* 페이지네이션 */}
              {totalPaymentPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPaymentPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)} 
                          className={currentPage === totalPaymentPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suspension" className="mt-6">
          {/* 정지 기록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>정지 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>정지 일시</TableHead>
                    <TableHead>정지 기간</TableHead>
                    <TableHead>정지 사유</TableHead>
                    <TableHead>승인 담당자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSuspensions.map((suspension) => (
                    <TableRow key={suspension.id}>
                      <TableCell>{formatDate(suspension.date)}</TableCell>
                      <TableCell>{suspension.duration}일</TableCell>
                      <TableCell>{suspension.reason}</TableCell>
                      <TableCell>{suspension.approver}</TableCell>
                    </TableRow>
                  ))}
                  {mockSuspensions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        정지 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* 페이지네이션 */}
              {totalSuspensionPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalSuspensionPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)} 
                          className={currentPage === totalSuspensionPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
