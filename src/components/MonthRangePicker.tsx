"use client";

import { useGetTransactionDateRanges } from "@/app/admin/hooks/useReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { endOfMonth, startOfMonth } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

const ALL_MONTHS = [
  { value: 0, label: "Januari" },
  { value: 1, label: "Februari" },
  { value: 2, label: "Maret" },
  { value: 3, label: "April" },
  { value: 4, label: "Mei" },
  { value: 5, label: "Juni" },
  { value: 6, label: "Juli" },
  { value: 7, label: "Agustus" },
  { value: 8, label: "September" },
  { value: 9, label: "Oktober" },
  { value: 10, label: "November" },
  { value: 11, label: "Desember" },
];

interface MonthRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onInitialDateSet: (date: DateRange) => void;
}

export function MonthRangePicker({
  className,
  date,
  setDate,
  onInitialDateSet,
}: MonthRangePickerProps) {
  const { data: dateRangeData, isLoading } = useGetTransactionDateRanges();
  const initialDateSet = React.useRef(false);

  React.useEffect(() => {
    if (
      dateRangeData?.firstDate &&
      dateRangeData.lastDate &&
      !initialDateSet.current
    ) {
      const initialRange = {
        from: startOfMonth(new Date(dateRangeData.firstDate)),
        to: endOfMonth(new Date(dateRangeData.lastDate)),
      };
      onInitialDateSet(initialRange);
      initialDateSet.current = true;
    }
  }, [dateRangeData, onInitialDateSet]);

  if (isLoading || !dateRangeData || !date) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-[220px]" />
        <span className="text-muted-foreground">-</span>
        <Skeleton className="h-10 w-[220px]" />
      </div>
    );
  }

  const { yearMonthsMap } = dateRangeData;
  const availableYears = Object.keys(yearMonthsMap).map(Number).sort();

  const fromYear = date.from?.getFullYear() ?? availableYears[0];
  const toYear =
    date.to?.getFullYear() ?? availableYears[availableYears.length - 1];

  const fromMonths = (yearMonthsMap[fromYear]?.months || []).map(
    (m) => ALL_MONTHS[m - 1],
  );
  const toMonths = (yearMonthsMap[toYear]?.months || []).map(
    (m) => ALL_MONTHS[m - 1],
  );

  const fromMonthValue = String(date.from?.getMonth() ?? fromMonths[0]?.value);
  const toMonthValue = String(
    date.to?.getMonth() ?? toMonths[toMonths.length - 1]?.value,
  );

  const handleDateChange = (
    part: "from" | "to",
    type: "month" | "year",
    value: string,
  ) => {
    const numericValue = Number(value);
    const currentFrom = date.from || new Date();
    const currentTo = date.to || new Date();

    let newFrom = new Date(currentFrom);
    let newTo = new Date(currentTo);

    if (part === "from") {
      const year = type === "year" ? numericValue : newFrom.getFullYear();
      const month = type === "month" ? numericValue : newFrom.getMonth();
      newFrom = startOfMonth(new Date(year, month));
    } else {
      const year = type === "year" ? numericValue : newTo.getFullYear();
      const month = type === "month" ? numericValue : newTo.getMonth();
      newTo = endOfMonth(new Date(year, month));
    }

    if (newTo < newFrom) {
      if (part === "from") newTo = endOfMonth(newFrom);
      if (part === "to") newFrom = startOfMonth(newTo);
    }

    setDate({ from: newFrom, to: newTo });
  };

  return (
    <div
      className={`flex items-center gap-4${className ? ` ${className}` : ""}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Dari:</span>
        <Select
          value={fromMonthValue}
          onValueChange={(v) => handleDateChange("from", "month", v)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fromMonths.map((m) => (
              <SelectItem key={`from-${m.value}`} value={String(m.value)}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(fromYear)}
          onValueChange={(v) => handleDateChange("from", "year", v)}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((y) => (
              <SelectItem key={`from-${y}`} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sampai:</span>
        <Select
          value={toMonthValue}
          onValueChange={(v) => handleDateChange("to", "month", v)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {toMonths.map((m) => (
              <SelectItem key={`to-${m.value}`} value={String(m.value)}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(toYear)}
          onValueChange={(v) => handleDateChange("to", "year", v)}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((y) => (
              <SelectItem key={`to-${y}`} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
