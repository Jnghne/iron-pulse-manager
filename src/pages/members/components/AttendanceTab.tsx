
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CalendarIcon, CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { ko } from 'date-fns/locale';
import { getMockAttendance, AttendanceRecord } from "@/data/mockData";
import { formatDate, getAttendanceStatus } from "@/lib/utils";

interface AttendanceTabProps {
  memberId: string;
}

export const AttendanceTab = ({ memberId }: AttendanceTabProps) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const attendanceData = getMockAttendance(memberId, 90);
    setAttendance(attendanceData);
    setFilteredAttendance(attendanceData);
  }, [memberId]);

  const calculateAttendanceRate = () => {
    const totalDays = attendance.length;
    if (totalDays === 0) return 0;
    
    const attendedDays = attendance.filter(record => record.attended).length;
    return Math.round((attendedDays / totalDays) * 100);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return;
    const filtered = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
    setFilteredAttendance(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredAttendance(attendance);
    setCurrentPage(1);
  };

  const attendanceRate = calculateAttendanceRate();
  const status = getAttendanceStatus(attendanceRate);

  // 페이징 관련 계산
  const totalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE);
  const pagedAttendance = filteredAttendance.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 날짜 검색 필터 UI 함수 분리
  function renderDateFilter() {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? formatDate(startDate) : <span className='text-muted-foreground'>시작일</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground">~</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? formatDate(endDate) : <span className='text-muted-foreground'>종료일</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Button size="sm" onClick={handleSearch} className="bg-gym-primary hover:bg-gym-primary/90 text-white">검색</Button>
        <Button size="sm" variant="outline" onClick={handleReset} className="border-gym-primary text-gym-primary hover:bg-gym-primary/10">초기화</Button>
      </div>
    );
  }

  // 연속 출석/미출석 일자 그룹화
  const getConsecutiveGroups = () => {
    const sortedAttendance = [...attendance].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const attendedGroups = [];
    const absentGroups = [];
    let currentAttendedGroup = [];
    let currentAbsentGroup = [];
    sortedAttendance.forEach((record, index) => {
      const currentDate = new Date(record.date);
      if (record.attended) {
        currentAttendedGroup.push(currentDate);
        if (currentAbsentGroup.length > 0) {
          absentGroups.push([...currentAbsentGroup]);
          currentAbsentGroup = [];
        }
      } else {
        currentAbsentGroup.push(currentDate);
        if (currentAttendedGroup.length > 0) {
          attendedGroups.push([...currentAttendedGroup]);
          currentAttendedGroup = [];
        }
      }
      if (index === sortedAttendance.length - 1) {
        if (currentAttendedGroup.length > 0) {
          attendedGroups.push([...currentAttendedGroup]);
        }
        if (currentAbsentGroup.length > 0) {
          absentGroups.push([...currentAbsentGroup]);
        }
      }
    });
    return { attendedGroups, absentGroups };
  };

  const { attendedGroups, absentGroups } = getConsecutiveGroups();

  // 캘린더 수정자 생성
  const modifiers = {};
  attendedGroups.forEach((group, groupIndex) => {
    if (group.length === 1) {
      modifiers[`attended-single-${groupIndex}`] = group;
    } else {
      // 첫날
      modifiers[`attended-first-${groupIndex}`] = [group[0]];
      // 중간 날짜들
      if (group.length > 2) {
        modifiers[`attended-middle-${groupIndex}`] = group.slice(1, -1);
      }
      // 마지막 날
      modifiers[`attended-last-${groupIndex}`] = [group[group.length - 1]];
    }
  });

  absentGroups.forEach((group, groupIndex) => {
    if (group.length === 1) {
      modifiers[`absent-single-${groupIndex}`] = group;
    } else {
      // 첫날
      modifiers[`absent-first-${groupIndex}`] = [group[0]];
      // 중간 날짜들
      if (group.length > 2) {
        modifiers[`absent-middle-${groupIndex}`] = group.slice(1, -1);
      }
      // 마지막 날
      modifiers[`absent-last-${groupIndex}`] = [group[group.length - 1]];
    }
  });

  // 수정자 스타일 생성
  const modifiersStyles: Record<string, React.CSSProperties> = Object.keys(modifiers).reduce((acc, key) => {
    if (key.startsWith('attended-single')) {
      acc[key] = {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        fontWeight: "bold",
        borderRadius: "0.5rem"
      };
    }
    if (key.startsWith('attended-first')) {
      acc[key] = {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        fontWeight: "bold",
        borderRadius: "0.5rem",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
        boxShadow: "3px 0 0 0 #f0fdf4",
        position: "relative",
        zIndex: "1"
      };
    }
    if (key.startsWith('attended-middle')) {
      acc[key] = {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        fontWeight: "bold",
        borderRadius: "0",
        boxShadow: "3px 0 0 0 #f0fdf4, -3px 0 0 0 #f0fdf4",
        position: "relative",
        zIndex: "1"
      };
    }
    if (key.startsWith('attended-last')) {
      acc[key] = {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        fontWeight: "bold",
        borderRadius: "0.5rem",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
        boxShadow: "-3px 0 0 0 #f0fdf4",
        position: "relative",
        zIndex: "1",
        marginRight: "6px"
      };
    }
    if (key.startsWith('absent-single')) {
      acc[key] = {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        fontWeight: "bold",
        borderRadius: "0.5rem"
      };
    }
    if (key.startsWith('absent-first')) {
      acc[key] = {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        fontWeight: "bold",
        borderRadius: "0.5rem",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
        boxShadow: "3px 0 0 0 #fef2f2",
        position: "relative",
        zIndex: "1"
      };
    }
    if (key.startsWith('absent-middle')) {
      acc[key] = {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        fontWeight: "bold",
        borderRadius: "0",
        boxShadow: "3px 0 0 0 #fef2f2, -3px 0 0 0 #fef2f2",
        position: "relative",
        zIndex: "1"
      };
    }
    if (key.startsWith('absent-last')) {
      acc[key] = {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        fontWeight: "bold",
        borderRadius: "0.5rem",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
        boxShadow: "-3px 0 0 0 #fef2f2",
        position: "relative",
        zIndex: "1",
        marginRight: "6px"
      };
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* 출석률 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg font-semibold">전체 출석률</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-gym-primary">{attendanceRate}%</div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all ${status.color}`}
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <Badge className={`${status.badgeColor} text-white`}>{status.label}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg font-semibold">최근 30일 방문</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-gym-primary">
                {attendance.slice(0, 30).filter(r => r.attended).length}일
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg font-semibold">최근 90일 방문</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-gym-primary">
                {attendance.filter(r => r.attended).length}일
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 출석 현황 달력과 출석 기록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 출석 현황 달력 - 왼쪽 */}
        <Card className="shadow-md overflow-hidden h-full flex flex-col">
          <CardHeader className="flex flex-col justify-start items-center text-center bg-slate-50 pb-3 border-b">
            <CardTitle className="text-center">출석 현황 달력</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col flex-1">
            <CalendarComponent
              mode="single"
              selected={new Date()} // Default to today, or manage selected date state if needed
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              locale={ko}
              className="rounded-md text-lg w-full flex-1"
              classNames={{
                table: 'w-full border-collapse',
                row: 'flex w-full my-10', // Increased vertical margin
                cell: 'flex-1 p-0 m-0 relative text-center', // flex-1 for equal width, content centering handled by day
                day: 'w-full h-[40px] flex items-center justify-center',
                day_selected: 'bg-transparent text-current font-bold',
                day_today: 'font-bold text-gym-primary ring-1 ring-gym-primary rounded-md',
                day_outside: 'text-muted-foreground opacity-30',
                head_cell: 'flex-1 text-muted-foreground rounded-md font-normal text-[0.8rem] text-center',
                head_row: 'flex w-full mt-2',
                caption_label: 'text-xl font-bold text-slate-700 pt-2',
                nav_button: 'h-8 w-8 bg-transparent hover:bg-gray-100 p-1 rounded-full',
                months: 'w-full',
                month: 'w-full space-y-2',
                caption: 'flex justify-center items-center relative pt-1 pb-2',
              }}
              styles={{}}
            />
            <div className="flex items-center justify-center space-x-6 text-sm mt-auto mb-2 bg-slate-50 py-3 px-4 rounded-md w-auto">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-100 rounded-md mr-2 border border-green-200"></div>
                <span className="font-medium text-green-700">출석</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-50 rounded-md mr-2 border border-red-200"></div>
                <span className="font-medium text-red-700">미출석</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 출석 기록 */}
        <Card>
          <CardHeader className="flex flex-col justify-start items-center text-center bg-slate-50 pb-3 border-b">
            <CardTitle className="text-center">출석 기록</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col flex-1">
            {renderDateFilter()}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold text-slate-700">날짜</TableHead>
                  <TableHead className="text-center font-bold text-slate-700">출석 여부</TableHead>
                  <TableHead className="text-center font-bold text-slate-700">입장 시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedAttendance.map((record, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-50/70'}>
                    <TableCell className="text-center font-medium">{formatDate(record.date)}</TableCell>
                    <TableCell className="text-center">
                      {record.attended ? (
                        <Badge className="bg-green-100 text-green-800 px-3 py-1 font-medium border border-green-200">출석</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 px-3 py-1 font-medium">미출석</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">{record.timeIn || "-"}</TableCell>
                  </TableRow>
                ))}
                {pagedAttendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-12 bg-slate-50/30">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CalendarOff size={48} className="text-slate-400" />
                        <span className="text-slate-500 text-lg font-medium">출석 기록이 없습니다.</span>
                        <span className="text-slate-400 text-sm">선택하신 기간에 해당하는 출석 정보가 없습니다.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gym-primary text-gym-primary hover:bg-gym-primary/10 h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium bg-slate-100 px-4 py-1.5 rounded-md text-slate-700">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gym-primary text-gym-primary hover:bg-gym-primary/10 h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
