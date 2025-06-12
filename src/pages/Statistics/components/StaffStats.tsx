
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';
import { StaffData } from '../types/statistics';

interface StaffStatsProps {
  staffData: StaffData[];
}

export const StaffStats = ({ staffData }: StaffStatsProps) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl border bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
              <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            직원 실적
          </CardTitle>
          <CardDescription className="text-base">직원별 PT 수업 및 매출 현황</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-center">직원명</TableHead>
                  <TableHead className="text-center font-semibold">PT 수업 수</TableHead>
                  <TableHead className="text-center font-semibold">매출</TableHead>
                  <TableHead className="text-center font-semibold">평점</TableHead>
                  <TableHead className="text-center font-semibold">신규 회원</TableHead>
                  <TableHead className="text-center font-semibold">회원 유지율</TableHead>
                  <TableHead className="text-center font-semibold">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffData.map((staff) => (
                  <TableRow key={staff.name} className="border-border/50 hover:bg-muted/20">
                    <TableCell className="font-semibold text-center">{staff.name}</TableCell>
                    <TableCell className="text-center font-medium">{staff.pt}회</TableCell>
                    <TableCell className="text-center font-semibold text-green-600 dark:text-green-400">
                      {staff.revenue.toLocaleString()}원
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-semibold">
                        ⭐ {staff.rating}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">{staff.newMembers}명</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        staff.retentionRate >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        staff.retentionRate >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {staff.retentionRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={staff.status === '정상' ? 'default' : staff.status === '휴직' ? 'secondary' : 'destructive'}
                        className="font-semibold"
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
