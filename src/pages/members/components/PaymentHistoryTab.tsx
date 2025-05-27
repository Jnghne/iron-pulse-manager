
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";

interface PaymentRecord {
  id: string;
  date: string;
  product: 'PT' | '헬스장 이용권';
  type: '신규' | '연장';
  productName: string;
  amount: number;
  paymentMethod: '카드' | '현금' | '계좌이체';
  installment?: string;
  status: '완료' | '실패' | '대기';
}

interface PaymentHistoryTabProps {
  memberId: string;
}

export const PaymentHistoryTab = ({ memberId }: PaymentHistoryTabProps) => {
  // Mock 결제 내역 데이터
  const mockPayments: PaymentRecord[] = [
    {
      id: "P001",
      date: "2024-03-15",
      product: "PT",
      type: "신규",
      productName: "PT 20회권",
      amount: 1000000,
      paymentMethod: "카드",
      installment: "일시불",
      status: "완료"
    },
    {
      id: "P002",
      date: "2024-02-01",
      product: "헬스장 이용권",
      type: "연장",
      productName: "헬스장 3개월권",
      amount: 300000,
      paymentMethod: "현금",
      status: "완료"
    },
    {
      id: "P003",
      date: "2024-01-15",
      product: "PT",
      type: "연장",
      productName: "PT 10회권",
      amount: 500000,
      paymentMethod: "계좌이체",
      status: "완료"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '완료':
        return <Badge className="bg-green-100 text-green-800">완료</Badge>;
      case '실패':
        return <Badge className="bg-red-100 text-red-800">실패</Badge>;
      case '대기':
        return <Badge className="bg-yellow-100 text-yellow-800">대기</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProductBadge = (product: string) => {
    switch (product) {
      case 'PT':
        return <Badge className="bg-blue-100 text-blue-800">PT</Badge>;
      case '헬스장 이용권':
        return <Badge className="bg-purple-100 text-purple-800">헬스장</Badge>;
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

  return (
    <div className="space-y-6">
      {/* 결제 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <TableHead>결제 상품</TableHead>
                <TableHead>결제 구분</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>결제 금액</TableHead>
                <TableHead>결제 수단</TableHead>
                <TableHead>할부 정보</TableHead>
                <TableHead>결제 상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>{getProductBadge(payment.product)}</TableCell>
                  <TableCell>{getTypeBadge(payment.type)}</TableCell>
                  <TableCell className="font-medium">{payment.productName}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{payment.installment || '-'}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                </TableRow>
              ))}
              {mockPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    결제 내역이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
