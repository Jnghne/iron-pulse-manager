import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Expense, ExpenseType, ExpenseTypeLabels, ExpenseFormData } from "@/types/expense";

interface ExpenseAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdd: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  selectedDate?: Date;
}

export const ExpenseAddDialog = ({ 
  open, 
  onOpenChange, 
  onExpenseAdd,
  selectedDate 
}: ExpenseAddDialogProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    type: 'other',
    title: '',
    amount: 0,
    description: '',
    date: selectedDate || new Date()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 데이터 리셋
  const resetForm = () => {
    setFormData({
      type: 'other',
      title: '',
      amount: 0,
      description: '',
      date: selectedDate || new Date()
    });
  };

  // 다이얼로그 열릴 때 날짜 업데이트
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || formData.amount <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 새 지출 객체 생성
      const newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
        type: formData.type,
        title: formData.title.trim(),
        amount: formData.amount,
        description: formData.description.trim(),
        date: formData.date
      };

      onExpenseAdd(newExpense);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('지출 등록 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 입력값 유효성 검사
  const isFormValid = formData.title.trim().length > 0 && formData.amount > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>지출 등록</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 지출 유형 */}
          <div className="space-y-2">
            <Label htmlFor="type">지출 유형 *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: ExpenseType) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="지출 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ExpenseTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 지출 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">지출 제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="지출 제목을 입력하세요"
              maxLength={100}
            />
          </div>

          {/* 지출 금액 */}
          <div className="space-y-2">
            <Label htmlFor="amount">지출 금액 (원) *</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                amount: parseInt(e.target.value) || 0 
              }))}
              placeholder="지출 금액을 입력하세요"
            />
          </div>

          {/* 지출 날짜 */}
          <div className="space-y-2">
            <Label>지출 날짜 *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP", { locale: ko })
                  ) : (
                    <span>날짜를 선택하세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 지출 상세내용 */}
          <div className="space-y-2">
            <Label htmlFor="description">지출 상세내용</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="지출에 대한 상세 내용을 입력하세요"
              maxLength={500}
              rows={3}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description.length}/500
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-gym-primary hover:bg-gym-primary/90"
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};