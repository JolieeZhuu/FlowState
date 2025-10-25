import WeeklyCalendar from "./WeeklyCalendar";
import { useState, useEffect } from "react";
import { type CalendarEvent } from "./types";



export default function IdealCalendar() {
    const [idealEvents, setIdealEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
    const newEvent = {
      id: Date.now(),           
      day: 1,                   
      startHour: 10,            
      duration: 2,             
      title: "Strategy Session",
      color: "bg-blue-500",
      type: "Study"
    };

    setIdealEvents(prev => [...prev, newEvent]);
  }, []);
    return (
        <div>
            <WeeklyCalendar
                title="Ideal Calendar"
                events = {idealEvents}
                setEvents = {setIdealEvents}
            />
        </div>
    )
};
