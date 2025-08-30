"use client";

import { Calendar } from "@/components/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import Button from "@/components/buttons/Button";
import clsxm from "@/lib/clsxm";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps extends React.ComponentProps<"div"> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  setDate,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    date?.from,
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(date?.to);

  // Sinkronisasi ke parent setiap kali startDate atau endDate berubah
  React.useEffect(() => {
    if (startDate && endDate) {
      setDate({ from: startDate, to: endDate });
    } else if (startDate) {
      setDate({ from: startDate, to: undefined });
    } else {
      setDate(undefined);
    }
  }, [startDate, endDate, setDate]);

  return (
    <div className={clsxm("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={clsxm(
              "w-[350px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih rentang tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex gap-6">
            {/* Kalender untuk tanggal mulai */}
            <div className="flex flex-col items-center">
              <p className="font-semibold mb-2">Tanggal Mulai</p>
              <Calendar
                mode="single"
                selected={startDate}
                disabled={endDate ? { after: endDate } : undefined}
                onSelect={(day) => {
                  setStartDate(day || undefined);
                  // Reset endDate jika tanggal mulai baru > tanggal akhir lama
                  if (day && endDate && day > endDate) {
                    setEndDate(undefined);
                  }
                }}
              />
            </div>

            {/* Kalender untuk tanggal akhir */}
            <div className="flex flex-col items-center">
              <p className="font-semibold mb-2">Tanggal Akhir</p>
              <Calendar
                mode="single"
                selected={endDate}
                disabled={startDate ? { before: startDate } : undefined}
                onSelect={(day) => {
                  // Pastikan tidak bisa pilih tanggal akhir sebelum tanggal mulai
                  if (startDate && day && day < startDate) return;
                  setEndDate(day || undefined);
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
