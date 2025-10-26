import { useEffect, useState } from "react";
import { type CalendarEvent } from "./types";
import PieChart, { convertToChartData } from "./ui/piechart";
import * as Mongo from "../api/mongo"

interface StatsProps {
  idealEvents: CalendarEvent[];
  actualEvents: CalendarEvent[];
}

let sampleData = {
  Work: 10,
  Exercise: 5,
  Leisure: 3,
  Study: 6,
  Sleep: 8
};

let sampleIdealData = {
    Work: 10,
    Exercise: 5,
    Leisure: 3,
    Study: 6,
    Sleep: 8
}

export default function Stats() {
  const [idealHours, setIdealHours] = useState<Record<string, number>>({});
  const [actualHours, setActualHours] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTasks = async () => {
        const allTasks = await Mongo.getAllTasks();
        console.log(allTasks);

        const actualTasks = allTasks.filter((task: any) => 
            task.calendar === "Actual Calendar" || task.calendar === "actual"
        );
        const idealTasks = allTasks.filter((task: any) => 
            task.calendar === "Ideal Calendar" || task.calendar === "ideal"
        );
        // Accumulate hours by type
        const idealHoursByType: { [key: string]: number } = {};
        const actualHoursByType: { [key: string]: number } = {};
        
        actualTasks.forEach((task: any) => {
            const type = task.type;
            const hours = task.hours || 0; // assuming each task has a 'hours' property
            
            if (actualHoursByType[type]) {
                actualHoursByType[type] += hours;
            } else {
                actualHoursByType[type] = hours;
            }
        });

        idealTasks.forEach((task: any) => {
            const type = task.type;
            const hours = task.hours || 0; // assuming each task has a 'hours' property
            
            if (idealHoursByType[type]) {
                idealHoursByType[type] += hours;
            } else {
                idealHoursByType[type] = hours;
            }
        });

        console.log("Actual Hours by Type:", actualHoursByType);
        console.log("Ideal Hours by Type:", idealHoursByType);

        setActualHours(actualHoursByType)
        setIdealHours(idealHoursByType)
        // Result will be something like: { Work: 10, Exercise: 5, Leisure: 3, ... }
    };

    fetchTasks();
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Stats</h2>
      <div className="grid grid-cols-2 gap-6">
        <PieChart 
          data={convertToChartData(idealHours)} 
          title="Ideal Time Distribution" 
        />
        <PieChart 
          data={convertToChartData(actualHours)} 
          title="Actual Time Distribution" 
        />
      </div>
    </div>
  );
}