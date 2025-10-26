import WeeklyCalendar from "./WeeklyCalendar";
import { useState, useEffect } from "react";
import { type CalendarEvent } from "./types";
import * as Mongo from "../api/mongo"

export default function ActualCalendar() {
    const [actualEvents, setActualEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
        const fetchTasks = async () => {
            const allTasks = await Mongo.getAllTasks();
            console.log(allTasks);
            setActualEvents(allTasks); // or whatever transformation you need
        };
        
        fetchTasks();
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
