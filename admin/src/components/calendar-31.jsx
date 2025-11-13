"use client";

import * as React from "react";
import { formatDateRange } from "little-date";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const events = [
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Design Review",
    from: "2025-06-12T11:30:00",
    to: "2025-06-12T12:30:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
];

export default function Calendar31() {
  const [date, setDate] = React.useState(new Date(2025, 5, 12));

  return (
    <Card className="w-full lg:w-fit py-4">
      <CardContent className="px-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="text-white rounded-lg [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
          required
        />
      </CardContent>
      <CardFooter className="hidden md:flex flex-col items-start gap-3 border-t border-white/10 px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1 text-white">
          <div className="text-sm font-medium text-white">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Add Event"
          >
            <PlusIcon />
            <span className="sr-only text-white">Add Event</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-[#121420] after:bg-white/40 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium text-white">{event.title}</div>
              <div className="text-muted-foreground text-xs text-white/60">
                {formatDateRange(new Date(event.from), new Date(event.to))}
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
