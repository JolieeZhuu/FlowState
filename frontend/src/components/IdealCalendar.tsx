import WeeklyCalendar from "./WeeklyCalendar";
import { useState, useEffect } from "react";
import { type CalendarEvent } from "./types";
import * as Mongo from "../api/mongo"

export default function IdealCalendar() {
    const [idealEvents, setIdealEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
    const fetchTasks = async () => {
        const allTasks = await Mongo.getAllTasks();
        console.log(allTasks);
        setIdealEvents(allTasks); // or whatever transformation you need
    };
    
    fetchTasks();
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
