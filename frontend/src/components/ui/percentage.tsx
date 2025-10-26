import { useEffect, useRef, useState } from 'react';

interface PercentageProps {
  numerator: number;
  denominator: number;
}

export default function PieChart({ numerator, denominator }: PercentageProps) {
    percentage = 
    <div>
        <h1></h1>
    </div>
}

// Helper function to convert object to array format
export function convertToChartData(data: Record<string, number>): PieChartData[] {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));
}