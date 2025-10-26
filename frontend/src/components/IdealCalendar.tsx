import React, { useEffect } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import { type CalendarEvent } from "./types";
import * as Mongo from "../api/mongo"

    useEffect(() => {
        const fetchTasks = async () => {
            const allTasks = await Mongo.getAllTasks();
            
            const idealTasks = allTasks.filter((task: any) => task.calendar === "Ideal Calendar" || task.calendar === "ideal");
            setIdealEvents(idealTasks);
        };
        fetchTasks();
    }, []);
    useEffect(() => {
        console.log("idealEvents updated:", idealEvents);
    }, [idealEvents]);
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
