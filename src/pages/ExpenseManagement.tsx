import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  DollarSign,
  Receipt
} from "lucide-react";
import { ExpenseAddDialog } from "./ExpenseManagement/components/ExpenseAddDialog";
import { getMockExpenses, getExpensesForDate, addMockExpense } from "@/data/mockExpenses";
import { Expense, ExpenseTypeLabels } from "@/types/expense";

const ExpenseManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isExpenseAddOpen, setIsExpenseAddOpen] = useState(false);
  const [expenses, setExpenses] = useState(getMockExpenses());

  // 현재 월의 이름 가져오기
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  // 월 변경 함수
  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // 선택된 날짜의 지출 필터링
  const getExpensesForSelectedDate = (date: Date) => {
    return expenses.filter(expense => {
      const expenseDate = expense.date.toISOString().split('T')[0];
      const targetDate = date.toISOString().split('T')[0];
      return expenseDate === targetDate;
    });
  };

  // 새 지출 추가 핸들러
  const handleExpenseAdd = (newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const expense = addMockExpense(newExpense);
    setExpenses(getMockExpenses());
  };

  // 금액 포맷팅
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  // 지출 타입별 색상
  const getExpenseTypeColor = (type: string) => {
    switch (type) {
      case 'personnel': return 'bg-blue-500';
      case 'rent': return 'bg-red-500';
      case 'utilities': return 'bg-green-500';
      case 'other': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedDateExpenses = selectedDate ? getExpensesForSelectedDate(selectedDate) : [];
  const selectedDateTotal = selectedDateExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 h-full">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">지출 관리</h1>
          <p className="text-muted-foreground">사업장의 지출을 등록하고 관리하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="bg-gym-primary hover:bg-gym-primary/90"
            onClick={() => setIsExpenseAddOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            지출 등록
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* 왼쪽: 캘린더 */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeMonth('prev')}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold min-w-[150px] text-center">
                      {getMonthName(currentDate)}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeMonth('next')}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentDate(new Date());
                      setSelectedDate(new Date());
                    }}
                  >
                    오늘
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="w-full"
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    caption: "hidden",
                    table: "w-full border-collapse",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm p-2 text-center",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full h-20 border border-gray-100",
                    day: "h-full w-full p-2 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-none flex flex-col items-start justify-start",
                    day_selected: "bg-gym-primary text-primary-foreground hover:bg-gym-primary hover:text-primary-foreground focus:bg-gym-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                  }}
                  components={{
                    Day: ({ date }) => {
                      const dayExpenses = getExpensesForSelectedDate(date);
                      const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      
                      return (
                        <div 
                          className={`h-full w-full p-2 flex flex-col cursor-pointer hover:bg-gray-50 ${
                            isSelected ? 'bg-gym-primary text-white' : ''
                          } ${isToday && !isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <span className={`text-sm ${isToday && !isSelected ? 'font-bold text-blue-600' : ''}`}>
                            {date.getDate()}
                          </span>
                          <div className="flex-1 w-full mt-1 space-y-0.5">
                            {dayExpenses.slice(0, 2).map((expense) => (
                              <div
                                key={expense.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${getExpenseTypeColor(expense.type)} text-white`}
                              >
                                {expense.title}
                              </div>
                            ))}
                            {dayExpenses.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayExpenses.length - 2}개 더
                              </div>
                            )}
                            {dayTotal > 0 && (
                              <div className="text-xs font-medium text-red-600">
                                {formatAmount(dayTotal)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 선택된 날짜의 지출 */}
        <div className="space-y-4 h-full flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate ? selectedDate.toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                }) : '날짜를 선택하세요'}
              </CardTitle>
              {selectedDateTotal > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>총 지출: <span className="font-medium text-red-600">{formatAmount(selectedDateTotal)}</span></span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3 flex-1 overflow-y-auto">
              {selectedDateExpenses.length > 0 ? (
                selectedDateExpenses.map((expense) => (
                  <div key={expense.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{expense.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {ExpenseTypeLabels[expense.type]}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-3 w-3" />
                          <span className="font-medium text-red-600">{formatAmount(expense.amount)}</span>
                        </div>
                      </div>
                      
                      {expense.description && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium text-gray-700">내용: </span>
                          <span className="text-gray-600">{expense.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>이 날에는 등록된 지출이 없습니다.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsExpenseAddOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    지출 등록하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 지출 등록 다이얼로그 */}
      <ExpenseAddDialog 
        open={isExpenseAddOpen}
        onOpenChange={setIsExpenseAddOpen}
        onExpenseAdd={handleExpenseAdd}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ExpenseManagement;