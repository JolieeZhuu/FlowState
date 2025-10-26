import WeeklyCalendar from "./WeeklyCalendar";
import { useState, useEffect } from "react";
import { type CalendarEvent } from "./types";

export default function ActualCalendar() {
    const [actualEvents, setActualEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
        /*
        const newEvent = {
            id: Number(Date.now()),
            day: 1,
            start_hour: 11,
            duration: 1,
            title: 'Strategy Session',
            color: 'bg-indigo-500', 
            date: new Date, // MM-DD-YYYY
            start_time: "",
            description: "",
            type: "",
        };

        setActualEvents(prev => [...prev, newEvent]);*/
        setActualEvents(prev => [...prev])
        // add whatever you need to add here
        // basically GET request here
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
