import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { getMockEvents } from "@/data/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SimpleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const events = getMockEvents();
  
  // 특정 날짜의 이벤트 개수 가져오기
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDateStr = event.date.toISOString().split('T')[0];
      const targetDateStr = date.toISOString().split('T')[0];
      return eventDateStr === targetDateStr;
    });
  };

  // 이벤트 요약 텍스트 생성 (Hover용)
  const getEventSummary = (dayEvents: any[]) => {
    if (dayEvents.length === 0) return "";
    if (dayEvents.length === 1) return dayEvents[0].title;
    return `${dayEvents.length}개 일정 - ${dayEvents[0].title} 외 ${dayEvents.length - 1}건`;
  };

  // 이벤트 타입별 라벨
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'pt': return 'PT';
      case 'group': return '그룹수업';
      case 'maintenance': return '시설관리';
      case 'event': return '이벤트';
      case 'meeting': return '회의';
      case 'other': return '기타';
      default: return '기타';
    }
  };
  
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
    <TooltipProvider>
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
          {calendarDays.map((day, index) => {
            // 현재 날짜의 이벤트 가져오기
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
            const dayEvents = day.isCurrentMonth ? getEventsForDate(date) : [];
            const eventSummary = getEventSummary(dayEvents);
            
            // 이벤트가 있는 날짜는 Tooltip + Popover, 없는 날짜는 일반 div
            if (dayEvents.length > 0 && day.isCurrentMonth) {
              return (
                <Popover key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <div
                          className={`
                            text-center text-sm cursor-pointer rounded-md transition-colors relative h-10 flex items-center justify-center
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
                          <span>{day.date}</span>
                          {/* 이벤트 표시 */}
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-1">
                              {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                                />
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-gray-500">+</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-sm">{eventSummary}</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80" align="center">
                    <div className="space-y-3">
                      <h4 className="font-medium text-lg">
                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 {day.date}일 일정
                      </h4>
                      <div className="space-y-2">
                        {dayEvents.map((event, eventIndex) => (
                          <div key={eventIndex} className="p-2 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="font-medium text-sm">{event.title}</h5>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {getEventTypeLabel(event.type)}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{event.time} {event.duration && `(${event.duration})`}</span>
                              </div>
                              {event.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{event.assignedTo}</span>
                                </div>
                              )}
                              {event.notes && (
                                <div className="mt-1 p-1 bg-gray-50 rounded text-xs">
                                  <span className="font-medium">메모: </span>
                                  <span>{event.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            } else {
              // 이벤트가 없는 날짜는 일반 div
              return (
                <div
                  key={index}
                  className={`
                    text-center text-sm rounded-md transition-colors h-10 flex items-center justify-center
                    ${day.isCurrentMonth 
                      ? 'text-gray-900' 
                      : 'text-gray-400'
                    }
                    ${day.isToday 
                      ? 'bg-gym-primary text-white' 
                      : ''
                    }
                  `}
                >
                  {day.date}
                </div>
              );
            }
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SimpleCalendar;