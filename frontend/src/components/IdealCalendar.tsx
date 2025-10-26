import React, { useEffect } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import { type CalendarEvent } from "./types";

interface IdealCalendarProps {
  events?: CalendarEvent[];
  setEvents?: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export default function IdealCalendar({ events, setEvents }: IdealCalendarProps) {
    // If parent passed events/setEvents (from Tabs), use them. Otherwise create local state inside this component.
    const [localEvents, setLocalEvents] = React.useState<any[]>([]);

    const useEvents: any[] = events ?? localEvents;
    const useSetEvents: React.Dispatch<React.SetStateAction<any[]>> = (setEvents as any) ?? setLocalEvents;

    useEffect(() => {
        // placeholder if we need initialization
    }, []);

    return (
        <div>
            <WeeklyCalendar
                title="Ideal Calendar"
                events={useEvents}
                setEvents={useSetEvents}
            />
        </div>
    )
};
