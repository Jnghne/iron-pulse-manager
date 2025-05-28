
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

  // 캘린더 수정자
  const modifiers = {
    attended: attendance
      .filter(record => record.attended)
      .map(record => new Date(record.date)),
    absent: attendance
      .filter(record => !record.attended && record.date)
      .map(record => new Date(record.date)),
  };

  const modifiersStyles = {
    attended: { 
      backgroundColor: "#f0fdf4",
      color: "#15803d",
      fontWeight: "bold"
    },
    absent: { 
      backgroundColor: "#fef2f2",
      color: "#dc2626"
    }
  };

  return (
    <div className="space-y-6">
      {/* 출석률 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <p className="text-sm text-muted-foreground">전체 출석률</p>
              <Badge className={`mt-2 ${status.color}`}>
                {status.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {attendance.slice(0, 30).filter(r => r.attended).length}
              </div>
              <p className="text-sm text-muted-foreground">최근 30일 방문</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {attendance.filter(r => r.attended).length}
              </div>
              <p className="text-sm text-muted-foreground">최근 90일 방문</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 출석 현황 달력과 출석 기록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 출석 현황 달력 - 왼쪽 */}
        <Card>
          <CardHeader>
            <CardTitle>출석 현황 달력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                className="rounded-md border"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                <span>출석</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-50 rounded mr-2"></div>
                <span>미출석</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 출석 기록 테이블 - 오른쪽 */}
        <Card>
          <CardHeader>
            <CardTitle>출석 기록</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[120px] justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate) : "시작일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <span>~</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[120px] justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate) : "종료일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button size="sm" onClick={handleSearch}>검색</Button>
              <Button size="sm" variant="outline" onClick={handleReset}>초기화</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>출석 여부</TableHead>
                    <TableHead>입장 시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>
                        {record.attended ? (
                          <Badge className="bg-green-100 text-green-800">출석</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">미출석</Badge>
                        )}
                      </TableCell>
                      <TableCell>{record.timeIn || "-"}</TableCell>
                    </TableRow>
                  ))}
                  {pagedAttendance.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        출석 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
