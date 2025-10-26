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

export async function editTask(data : Event){
    const response = await fetch(`${BACKEND}/database/editTask`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to edit task");
    return response.json(); 
}

export async function deleteTask(id: number){
    const response = await fetch(`${BACKEND}/database/deleteTask?id=${id}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
    
    return await response.json();
}

export async function getAllTasks(){
    const response = await fetch(`${BACKEND}/database/getAllTasks`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error('Failed to get tasks');
    }
    
    return await response.json();
}