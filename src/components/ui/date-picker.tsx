"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale"; // 한국어 로케일 추가
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  selected?: Date | null;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean; // disabled prop 추가
  placeholder?: string; // placeholder prop 추가
}

export function DatePicker({
  selected,
  onSelect,
  className,
  disabled, // disabled prop 사용
  placeholder = "날짜를 선택하세요", // 기본 placeholder 설정
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled} // Button에 disabled prop 전달
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: ko }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected ?? undefined} // selected가 null일 경우 undefined로 전달
          onSelect={onSelect}
          initialFocus
          locale={ko} // 한국어 로케일 적용
          disabled={disabled} // Calendar에 disabled prop 전달 (React DayPicker의 disabled prop 사용)
        />
      </PopoverContent>
    </Popover>
  );
}
