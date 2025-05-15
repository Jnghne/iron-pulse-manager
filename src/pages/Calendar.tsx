
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [branch, setBranch] = useState("main");
  const [viewType, setViewType] = useState("schedule");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">캘린더 관리</h1>
          <p className="text-muted-foreground">헬스장 일정 및 트레이너 스케줄을 관리합니다.</p>
        </div>
        
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="지점 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">본점</SelectItem>
            <SelectItem value="gangnam">강남점</SelectItem>
            <SelectItem value="hongdae">홍대점</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle>캘린더</CardTitle>
            <Tabs value={viewType} onValueChange={setViewType} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule">일정 보기</TabsTrigger>
                <TabsTrigger value="trainer">트레이너 시간</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewType}>
            <TabsContent value="schedule" className="mt-0">
              <div className="flex justify-center border rounded-lg p-4 bg-white">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-3">일정 목록</h3>
                <div className="text-center text-muted-foreground py-12">
                  아직 등록된 일정이 없습니다.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trainer" className="mt-0">
              <div className="flex justify-center border rounded-lg p-4 bg-white">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-3">트레이너 스케줄</h3>
                <div className="text-center text-muted-foreground py-12">
                  아직 등록된 트레이너 스케줄이 없습니다.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
