
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from 'lucide-react';
import { MemberData } from '../types/statistics';

interface StatsSummaryCardsProps {
  currentMonthData: MemberData;
  businessName: string;
}

export const StatsSummaryCards = ({ currentMonthData, businessName }: StatsSummaryCardsProps) => {
  return (
    <Card className="shadow-xl border bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
            <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          회원 요약
        </CardTitle>
        <CardDescription className="text-base">{businessName} 회원 현황 세부사항</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30 shadow-lg">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">{currentMonthData.total}</div>
            <div className="text-sm font-medium text-muted-foreground">총 회원 수</div>
          </div>
          <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/30 shadow-lg">
            <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">{currentMonthData.active}</div>
            <div className="text-sm font-medium text-muted-foreground">활성 회원</div>
          </div>
          <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/30 shadow-lg">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2">{currentMonthData.pt}</div>
            <div className="text-sm font-medium text-muted-foreground">PT 회원</div>
          </div>
          <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/30 shadow-lg">
            <div className="text-3xl font-bold text-slate-700 dark:text-slate-400 mb-2">{currentMonthData.inactive}</div>
            <div className="text-sm font-medium text-muted-foreground">휴면 회원</div>
          </div>
          <div className="text-center p-6 border-0 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/30 dark:to-sky-900/30 shadow-lg">
            <div className="text-3xl font-bold text-sky-700 dark:text-sky-400 mb-2">32</div>
            <div className="text-sm font-medium text-muted-foreground">신규 회원</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
