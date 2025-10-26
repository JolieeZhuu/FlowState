import { type CalendarEvent as Event } from "@/components/types"

const BACKEND = "http://localhost:3000"

export async function createTask(data : Event){
    const response = await fetch(`${BACKEND}/database/createTask`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
}