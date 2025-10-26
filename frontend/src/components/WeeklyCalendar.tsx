import React, { useState } from 'react';
import { Clock, Trash2, Pencil, ChevronDownIcon } from 'lucide-react';
import { type CalendarEvent as Event} from './types';
import { taskTypeOptions } from './types';
import { timeOptions } from './types';

import dayjs from 'dayjs'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

import * as Mongo from "../api/mongo"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ComboboxOptions } from './combobox-options';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface CalendarEvent {
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
}

interface CreateStart {
    day: number;
    hour: number;
}

interface WeeklyCalendarProps {
    title: string;
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

/*
{
   “_id”: 1
   “title”: “Task 1”,
   “date”: “MM-DD-YYYY”,
   “start_time”: “24-hour”,
   “duration”: 1, // by hours
   “description”: “”
   “type”: “Study”,
   “calendar”: “ideal”
   “completed : “false”
   “user_id” : ? not sure yet
}
*/

const calendarSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required.",
    }),
    date: z.date({
        message: "Last name is required.",
    }),
    start_time: z.string().min(1, {
        message: "Start time is required."
    }),
    duration: z.number().min(0.5, {
        message: "Duration must be >= 0.5."
    }),
    description: z.string().optional(),
    type: z.string().min(1, {
        message: "Task type is required."
    })
});

export default function WeeklyCalendar({ title, events, setEvents }: WeeklyCalendarProps) {
    const hours: number[] = Array.from({ length: 24 }, (_, i) => i);
    const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    /*const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, day: 1, start_hour: 9, duration: 2, title: 'Team Meeting', color: 'bg-blue-500' },
    { id: 2, day: 3, start_hour: 14, duration: 1, title: 'Client Call', color: 'bg-green-500' },
    { id: 3, day: 5, start_hour: 10, duration: 3, title: 'Project Work', color: 'bg-purple-500' },
    ]);*/
    // will need to edit this by 

    function generateStartHour(startTime: string) {
        const [hour, ending] = startTime.split(" ");
        let newHour = parseInt(hour);
        if (ending == "PM" && newHour !== 12) {
            newHour += 12;
        } else if (ending == "AM" && newHour === 12) {
            newHour = 0;
        } return newHour;
    }

    /*
    0: Sunday
    1: Monday
    2: Tuesday
    3: Wednesday
    4: Thursday
    5: Friday
    6: Saturday
    */

    // Month Day ***

    const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [createStart, setCreateStart] = useState<CreateStart | null>(null);
    const [newEvent, setNewEvent] = useState<CalendarEvent | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [index, setIndex] = useState<number | null>(null);
    const [openPopover, setOpenPopover] = React.useState(false) // For the calendar popover


    const form = useForm<z.infer<typeof calendarSchema>>({
        resolver: zodResolver(calendarSchema),
        defaultValues: {
            title: "",
            date: undefined,
            start_time: "",
            duration: 1,
            description: "",
            type: ""
        },
    })

    async function onSubmit(values: z.infer<typeof calendarSchema>) {
            if (index !== null) {
            console.log(generateStartHour(values.start_time))
            setEvents(prevEvents => prevEvents.map(event =>
                event.id === index
                    ? {
                        ...event,
                        title: values.title,
                        day: Number(dayjs(values.date.toString()).format('d')),
                        start_hour: generateStartHour(values.start_time),
                        duration: values.duration,
                        date: values.date,
                        start_time: values.start_time,
                        description: values.description ? values.description : "",
                        calender: title.toLowerCase(),
                        type: values.type ? values.type : ""
                    }
                    : event
            ));
            setOpen(false);
        }
    }

    const formatHour = (hour: number): string => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, event: CalendarEvent): void => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: number, hour: number): void => {
    e.preventDefault();
    if (draggedEvent) {
        setEvents(events.map(evt => 
            evt.id === draggedEvent.id 
                ? { ...evt, day, start_hour: hour }
                : evt
        ));
        setDraggedEvent(null);
    }
    };

    const handleMouseDown = (day: number, hour: number): void => {
    setIsCreating(true);
    setCreateStart({ day, hour });
    const data = {
        id: Number(Date.now()),
        day: day,
        start_hour: hour,
        duration: 1,
        title: 'New Event',
        color: 'bg-indigo-500', 
        date: undefined, // MM-DD-YYYY
        start_time: formatHour(hour),
        description: "",
        type: "",
        calender: title,
    }
    setNewEvent(data);
    /*interface CalendarEvent {
        id: number;
        day: number;
        start_hour: number;
        duration: number;
        title: string;
        color: string;
        date?: Date;
        start_time?: string;
        description?: string;
        type?: string;
    }
    */

    console.log(Mongo.createTask(data));

    };

    const handleMouseEnter = (day: number, hour: number): void => {
    if (isCreating && createStart && createStart.day === day) {
        const duration = Math.abs(hour - createStart.hour) + 1;
        const start_hour = Math.min(createStart.hour, hour);
        setNewEvent(prev => prev ? {
        ...prev,
        start_hour,
        duration
        } : null);
    }
    };

    const handleMouseUp = (): void => {
    if (isCreating && newEvent) {
        const title = prompt('Event title:', 'New Event');
        if (title) {
        setEvents([...events, { ...newEvent, title }]);
        }
        setIsCreating(false);
        setCreateStart(null);
        setNewEvent(null);
    }
    };

    const deleteEvent = (id: number): void => {
        setEvents(events.filter(e => e.id !== id));
    };

    const editEvent = (id: number): void => {
        const event = events.find(e => e.id === id);
        if (event) {
            form.reset({
                title: event.title || "",
                date: event.date || undefined,
                start_time: event.start_time || "",
                duration: event.duration || 1,
                description: event.description || "",
                type: event.type || ""
            });
        }
        setIndex(id);
        setOpen(true);
    }

    const allEvents: CalendarEvent[] = isCreating && newEvent ? [...events, newEvent] : events;

    return (
    <div className="w-full h-screen bg-gray-50 p-4 overflow-hidden flex flex-col">
        <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">
            Click and drag to create events • Drag events to move them • Click trash to delete
        </p>
        </div>

        <div className="flex-1 overflow-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="grid grid-cols-8 min-w-max">
            {/* Header Row */}
            <div className="sticky top-0 bg-gray-100 border-b border-r border-gray-300 p-3 z-20">
            <span className="text-xs font-semibold text-gray-600">Time</span>
            </div>
            {days.map((day, idx) => (
            <div key={day} className="sticky top-0 bg-gray-100 border-b border-gray-300 p-3 text-center min-w-[140px] z-20">
                <div className="font-semibold text-gray-800">{day}</div>
                {/* insert MM DD */}
            </div>
            ))}

            {/* Time slots */}
            {hours.map(hour => (
            <React.Fragment key={hour}>
                <div className="border-b border-r border-gray-200 p-2 bg-gray-50 sticky left-0 z-10">
                <span className="text-xs text-gray-600 font-medium">{formatHour(hour)}</span>
                </div>
                {days.map((_, dayIdx) => (
                <div
                    key={`${dayIdx}-${hour}`}
                    className="border-b border-gray-200 min-h-[80px] relative hover:bg-blue-50 transition-colors cursor-crosshair"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dayIdx, hour)}
                    onMouseDown={() => handleMouseDown(dayIdx, hour)}
                    onMouseEnter={() => handleMouseEnter(dayIdx, hour)}
                    onMouseUp={handleMouseUp}
                >
                    
                    {allEvents
                    .filter(e => e.day === dayIdx && e.start_hour === hour)
                    .map(event => (
                        <div key={event.id}>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <div
                                    draggable={!isCreating}
                                    onDragStart={(e) => handleDragStart(e, event)}
                                    className={`absolute inset-x-1 ${event.color} rounded-md p-4 min-h-[70px] cursor-move shadow-md text-white text-base overflow-hidden group hover:shadow-lg transition-shadow`}
                                    style={{
                                        top: 0,
                                        height: `calc(100% * ${event.duration})`,
                                        zIndex: 10
                                    }}
                                    >
                                    <div className="font-semibold truncate text-base">{event.title}</div>
                                    <div className="text-xs opacity-90">
                                        {formatHour(event.start_hour)} - {formatHour(event.start_hour + event.duration)}
                                    </div>
                                    {!isCreating && (
                                        <div className="flex gap-2 absolute top-1 right-1">
                                        <button
                                            onMouseDown={e => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                editEvent(event.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-blue-600 rounded p-1 hover:bg-blue-50"
                                            title="Edit"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                        <button
                                            onMouseDown={e => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteEvent(event.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-600 rounded p-1 hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        </div>
                                    )}
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                    <div className="font-bold text-lg">{event.title}</div>
                                    <div className="text-sm text-gray-700">{event.description || 'No description'}</div>
                                    <div className="text-xs text-gray-500">Date: {event.date ? event.date.toLocaleDateString() : 'N/A'}</div>
                                    <div className="text-xs text-gray-500">Time: {event.start_time || formatHour(event.start_hour)}</div>
                                    <div className="text-xs text-gray-500">Duration: {event.duration} hour(s)</div>
                                    <div className="text-xs text-gray-500">Type: {event.type || 'N/A'}</div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    ))}
                </div>
                ))}
            </React.Fragment>
            ))}
        </div>
        </div>
        {/* Dialog for editing event */}
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[450px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        {
                            /*
                                title: "",
                                date: undefined,
                                start_time: "",
                                duration: 1,
                                description: "",
                                type: ""
                            */
                        }
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" placeholder="ex: Team Meeting" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Popover open={openPopover} onOpenChange={setOpenPopover} {...field}>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-full justify-between font-normal"
                                            >
                                                {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    captionLayout="dropdown"
                                                    onSelect={(selectedDate) => {
                                                        field.onChange(selectedDate)
                                                        setOpenPopover(false)
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="start_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <ComboboxOptions
                                            options={timeOptions}
                                            value={String(field.value)} 
                                            onChange={field.onChange} 
                                            selectPhrase="Select..."
                                            commandEmpty="Selection not found."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (hours)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0.5}
                                            step={0.5}
                                            className="w-full"
                                            placeholder="ex: 1.5"
                                            value={field.value ?? ''}
                                            onChange={e => {
                                                const value = e.target.value;
                                                field.onChange(value === '' ? undefined : Number(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" placeholder="ex: Weekly sync meeting" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                            <ComboboxOptions
                                                options={taskTypeOptions}
                                                value={String(field.value)} 
                                                onChange={field.onChange} 
                                                selectPhrase="Select..."
                                                commandEmpty="Selection not found."
                                            />                                    
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Edit Task</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
    );
};