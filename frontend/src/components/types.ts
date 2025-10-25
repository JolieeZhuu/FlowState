export type CalendarEvent = {
  id: number;
  day: number;
  startHour: number;
  duration: number;
  title: string;
  color: string;
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
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
    { value: "12 PM", label: "12 PM"},
]