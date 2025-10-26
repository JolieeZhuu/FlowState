import mongoose, { Date, Document, Schema } from 'mongoose';

export interface ITask extends Document {
    id: number
    title: string;
    day: number;
    date: Date;
    start_hour: number;
    color: string;
    start_time : string;
    duration: number;
    description?: string;
    type: string;
    calendar: string;
    userId: string;
}

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
        day: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: false,
            default: ''
        },
        start_hour: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
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
        calendar: {
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