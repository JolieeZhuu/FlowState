import WeeklyCalendar from "./WeeklyCalendar";
import { useState, useEffect } from "react";
import { type CalendarEvent } from "./types";
import * as Mongo from "../api/mongo"

export default function ActualCalendar() {
    const [actualEvents, setActualEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
        const fetchTasks = async () => {
            const allTasks = await Mongo.getAllTasks();
            console.log(allTasks)

            const actualTasks = allTasks.filter((task: any) => task.calendar === "Actual Calendar" || task.calendar === "actual");
            setActualEvents(actualTasks); // or whatever transformation you need
        };
        
        fetchTasks();
        console.log(actualEvents)
    }, []);

    useEffect(() => {
    console.log("actualEvents updated:", actualEvents);
}, [actualEvents]);
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
