
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Filter
} from "lucide-react";
import { ScheduleAddDialog } from "./Calendar/components/ScheduleAddDialog";
import { mockStaff, getMockEvents, addMockEvent, Event } from "@/data/mockData";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedStaff, setSelectedStaff] = useState<string[]>(mockStaff.map(s => s.id));
  const [isScheduleAddOpen, setIsScheduleAddOpen] = useState(false);
  const [events, setEvents] = useState(getMockEvents());

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

  // 선택된 날짜의 이벤트 필터링 (직원 필터 적용)
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      // Date 객체를 YYYY-MM-DD 형식으로 비교
      const eventDateStr = event.date.toISOString().split('T')[0];
      const targetDateStr = date.toISOString().split('T')[0];
      const eventDate = eventDateStr === targetDateStr;
      
      // assignedTo가 직원 이름인 경우, 해당 이름을 가진 직원의 ID 찾기
      const staffMember = mockStaff.find(staff => staff.name === event.assignedTo);
      const staffId = staffMember ? staffMember.id : event.assignedTo;
      
      return eventDate && selectedStaff.includes(staffId);
    });
  };

  // 새 이벤트 추가 핸들러
  const handleEventAdd = (newEvent: Event) => {
    // mockData에 이벤트 추가
    addMockEvent(newEvent);
    // 상태 업데이트
    setEvents(getMockEvents());
  };

  // 이벤트 타입별 라벨
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'lesson': return '개인레슨';
      case 'group': return '그룹수업';
      case 'maintenance': return '시설관리';
      case 'event': return '이벤트';
      case 'meeting': return '회의';
      case 'other': return '기타';
      default: return '기타';
    }
  };

  // 직원 필터 토글
  const toggleStaff = (staffId: string) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  // 모든 직원 선택/해제
  const toggleAllStaff = () => {
    setSelectedStaff(prev => 
      prev.length === mockStaff.length ? [] : mockStaff.map(s => s.id)
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6 h-full">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {/* 직원 필터 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                직원 필터 ({selectedStaff.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">직원 선택</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleAllStaff}
                  >
                    {selectedStaff.length === mockStaff.length ? '전체 해제' : '전체 선택'}
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockStaff.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={staff.id}
                        checked={selectedStaff.includes(staff.id)}
                        onCheckedChange={() => toggleStaff(staff.id)}
                      />
                      <label 
                        htmlFor={staff.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {staff.name} 
                        <span className="text-xs text-muted-foreground ml-1">
                          ({staff.role === 'owner' ? '사장' : '직원'})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          
          <Button 
            className="bg-gym-primary hover:bg-gym-primary/90"
            onClick={() => setIsScheduleAddOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            일정 추가
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
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    월
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    주
                  </Button>
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                  >
                    일
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
                    caption: "hidden", // 헤더는 위에서 커스텀으로 만듦
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
                      const dayEvents = getEventsForDate(date);
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
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${event.color} text-white`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayEvents.length - 2}개 더
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

        {/* 오른쪽: 선택된 날짜의 일정 */}
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
            </CardHeader>
            <CardContent className="space-y-3 flex-1 overflow-y-auto">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time} {event.duration && `(${event.duration})`}</span>
                      </div>
                      
                      {event.trainer && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{event.trainer}</span>
                        </div>
                      )}
                      
                      
                      {event.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium text-gray-700">메모: </span>
                          <span className="text-gray-600">{event.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>이 날에는 예정된 일정이 없습니다.</p>
                  {selectedStaff.length === 0 && (
                    <p className="text-sm mt-2">직원 필터를 확인해보세요.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
      
      {/* 일정 추가 다이얼로그 */}
      <ScheduleAddDialog 
        open={isScheduleAddOpen}
        onOpenChange={setIsScheduleAddOpen}
        onEventAdd={handleEventAdd}
      />
    </div>
  );
};

export default Calendar;
