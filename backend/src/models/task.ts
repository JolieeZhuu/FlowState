import mongoose, { Date, Document, Schema } from 'mongoose';

export interface ITask extends Document {
    id: number
    title: string;
    date: String;
    start_time : string;
    duration: number;
    description?: string;
    type: string;
    calender: string;
    userId: string;
}

/*
   “id”: 1
   “title”: “Task 1”,
   “date”: “MM-DD-YYYY”,
   “day_of_week”: “Monday”,
   “start_time”: “24-hour”,
   “duration”: “24-hour”,
   “type”: “Study”,
   “calendar”: “ideal”
*/

const TaskSchema: Schema = new Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        date: {
            type: String,
            required: true,
        },
        start_time: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        type: {
            type: String,
            required: false,
            default: '',
        },
        calender: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying by userId
TaskSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ITask>('Task', TaskSchema);