import WeeklyCalendar from "./WeeklyCalendar";
import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { type CalendarEvent } from "./types";
import * as Mongo from "../api/mongo"

interface IdealCalendarProps {
    events: CalendarEvent[];
    setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
}

export default function IdealCalendar({ events, setEvents }: IdealCalendarProps) {
    useEffect(() => {
        const fetchTasks = async () => {
            const allTasks = await Mongo.getAllTasks();
            
            const idealTasks = allTasks.filter((task: any) => task.calendar === "Ideal Calendar" || task.calendar === "ideal");
            setEvents(idealTasks);
        };
        fetchTasks();
    }, [setEvents]);
    
    useEffect(() => {
        console.log("idealEvents updated:", events);
    }, [events]);
    
    return (
        <div>
            <WeeklyCalendar
                title="Ideal Calendar"
                events={events}
                setEvents={setEvents}
            />
        </div>
    )
};