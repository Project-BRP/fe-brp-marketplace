// src/components/Calendar.tsx
"use client";

import clsxm from "@/lib/clsxm";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={clsxm("p-3", className)}
      navLayout="after"
      /* NOTE: Using react-day-picker v9 classNames keys so modifier styles apply */
      classNames={{
        // Containers
        root: "p-0",
        months: "flex flex-col gap-6",
        month: "relative space-y-2",
        month_caption: "relative flex items-center justify-center py-2 mb-1",
        caption_label: "text-sm font-medium text-gray-900",
        // Place nav inside month, overlaying the caption area
        nav: "absolute inset-x-0 top-2 z-10 flex items-center justify-between px-1",
        button_previous:
          "h-6 w-6 rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors",
        button_next:
          "h-6 w-6 rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors",
        chevron: "h-4 w-4",

        // Grid
        month_grid: "w-full border-separate border-spacing-1",
        weekdays: "",
        weekday: "w-9 text-center font-medium text-xs text-muted-foreground",
        weeks: "",
        week: "",

        // Day cells and button
        day: "p-0 text-center align-middle",
        day_button:
          "mx-auto h-9 w-9 rounded-md p-0 font-normal text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

        // Selection states & flags (v9 keys)
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        range_end: "",
        range_start: "",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
      }}
      // Custom chevrons (v9 uses a single Chevron component)
      components={{
        Chevron: ({ orientation, className }) => {
          const common = clsxm("h-4 w-4", className);
          switch (orientation) {
            case "left":
              return <ChevronLeft className={common} />;
            case "right":
              return <ChevronRight className={common} />;
            case "up":
              return <ChevronUp className={common} />;
            case "down":
            default:
              return <ChevronDown className={common} />;
          }
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
