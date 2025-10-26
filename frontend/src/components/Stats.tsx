import { useEffect, useState } from "react";
import { type CalendarEvent } from "./types";
import PieChart, { convertToChartData } from "./ui/piechart";

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Stats</h2>
      <div className="grid grid-cols-2 gap-6">
        <PieChart 
          data={convertToChartData(sampleData)} 
          title="Actual Time Distribution" 
        />
        <PieChart 
          data={convertToChartData(sampleData)} 
          title="Ideal Time Distribution" 
        />
      </div>
    </div>
  );
}