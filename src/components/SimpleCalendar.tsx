import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SimpleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 이전 달로 이동
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // 현재 달의 첫 번째 날
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // 현재 달의 마지막 날
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  // 첫 번째 날의 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayWeekday = firstDayOfMonth.getDay();
  // 현재 달의 총 일수
  const daysInMonth = lastDayOfMonth.getDate();
  
  // 달력에 표시할 날짜들을 생성
  const calendarDays = [];
  
  // 이전 달의 마지막 날들 (빈 칸 채우기)
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
    calendarDays.push({
      date: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // 현재 달의 날짜들
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = date.toDateString() === today.toDateString();
    
    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      isToday
    });
  }
  
  // 다음 달의 첫 번째 날들 (빈 칸 채우기)
  const remainingDays = 42 - calendarDays.length; // 6주 * 7일 = 42일
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              text-center text-sm py-2 cursor-pointer rounded-md transition-colors
              ${day.isCurrentMonth 
                ? 'text-gray-900 hover:bg-gray-100' 
                : 'text-gray-400'
              }
              ${day.isToday 
                ? 'bg-gym-primary text-white hover:bg-gym-primary/90' 
                : ''
              }
            `}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleCalendar;