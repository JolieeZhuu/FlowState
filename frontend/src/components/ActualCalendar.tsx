import WeeklyCalendar from "./WeeklyCalendar";
import { useState, useEffect } from "react";
import { type CalendarEvent } from "./types";

export default function ActualCalendar() {
    const [actualEvents, setActualEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
    const newEvent = {
        id: Date.now(),           
        day: 1,                   
        startHour: 11,            
        duration: 1,             
        title: "Strategy Session",
        color: "bg-blue-500"
    };

    setActualEvents(prev => [...prev, newEvent]);
  }, []);
    return (
        <div>
            <WeeklyCalendar
                title="Actual Calendar"
                events = {actualEvents}
                setEvents = {setActualEvents}
            />
        </div>
    )
};
