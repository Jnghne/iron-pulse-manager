
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
      <CardHeader className="bg-slate-50/70 dark:bg-slate-800/20 border-b">
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
          <div className="text-center p-6 border border-blue-100 dark:border-blue-900/30 rounded-xl bg-white dark:bg-slate-800/20 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">{currentMonthData.total}</div>
            <div className="text-sm font-medium text-muted-foreground">총 회원 수</div>
          </div>
          <div className="text-center p-6 border border-green-100 dark:border-green-900/30 rounded-xl bg-white dark:bg-slate-800/20 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">{currentMonthData.active}</div>
            <div className="text-sm font-medium text-muted-foreground">활성 회원</div>
          </div>
          <div className="text-center p-6 border border-amber-100 dark:border-amber-900/30 rounded-xl bg-white dark:bg-slate-800/20 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2">{currentMonthData.lesson}</div>
            <div className="text-sm font-medium text-muted-foreground">개인레슨 회원</div>
          </div>
          <div className="text-center p-6 border border-slate-100 dark:border-slate-700/50 rounded-xl bg-white dark:bg-slate-800/20 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-slate-700 dark:text-slate-400 mb-2">{currentMonthData.inactive}</div>
            <div className="text-sm font-medium text-muted-foreground">휴면 회원</div>
          </div>
          <div className="text-center p-6 border border-sky-100 dark:border-sky-900/30 rounded-xl bg-white dark:bg-slate-800/20 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-sky-700 dark:text-sky-400 mb-2">32</div>
            <div className="text-sm font-medium text-muted-foreground">신규 회원</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
