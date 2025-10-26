export type CalendarEvent = {
    id: number;
    day: number;
    start_hour: number;
    duration: number;
    title: string;
    color: string;
    date?: Date;
    start_time: string;
    description: string;
    type: string;
    calender: string;
}

export const taskTypeOptions = [
    {
        value: "Sleep",
        label: "Sleep"
    },
    {
        value: "Study",
        label: "Study"
    },
    {
        value: "Break",
        label: "Break"
    },
    {
        value: "Exercise",
        label: "Exercise"
    },
    {
        value: "School",
        label: "School"
    }
]

export const timeOptions = [
    { value: "12 AM", label: "12 AM"},
    { value: "1 AM", label: "1 AM"},
    { value: "2 AM", label: "2 AM"},
    { value: "3 AM", label: "3 AM"},
    { value: "4 AM", label: "4 AM"},
    { value: "5 AM", label: "5 AM"},
    { value: "6 AM", label: "6 AM"},
    { value: "7 AM", label: "7 AM"},
    { value: "8 AM", label: "8 AM"},
    { value: "9 AM", label: "9 AM"},
    { value: "10 AM", label: "10 AM"},
    { value: "11 AM", label: "1 AM"},
    { value: "12 PM", label: "12 PM"},
    { value: "1 PM", label: "1 PM"},
    { value: "2 PM", label: "2 PM"},
    { value: "3 PM", label: "3 PM"},
    { value: "4 PM", label: "4 PM"},
    { value: "5 PM", label: "5 PM"},
    { value: "6 PM", label: "6 PM"},
    { value: "7 PM", label: "7 PM"},
    { value: "8 PM", label: "8 PM"},
    { value: "9 PM", label: "9 PM"},
    { value: "10 PM", label: "10 PM"},
    { value: "11 PM", label: "11 PM"},
]