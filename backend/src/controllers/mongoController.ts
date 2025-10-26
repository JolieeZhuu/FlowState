import { Response } from "express";
import Task from '../models/task';
import { AuthRequest } from '../middleware/auth';

export async function getUserTasks(req: AuthRequest, res: Response){
    try{
        const userId = req.user?._id 
        const tasks = await Task.find({ userId: userId }).sort({ createdAt: -1 });
        res.json(tasks)
    }
    catch (error){
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
}

export async function getTask(req : AuthRequest, res: Response){
    try {
        const taskId = req.query.id
        const task = await Task.findOne({id: taskId});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log("Got Task")
        res.json(task);
    }
    catch (error) {
        console.error('Find task error:', error); 
        res.status(500).json({ message: 'Error fetching task', error });
    }
}

export async function createTask(req: AuthRequest, res: Response){
    console.log(req.body)
    try{
        const task = new Task({
            id: req.body.id,
            title: req.body.title,
            day: req.body.day,
            date: req.body.date,
            start_hour: req.body.start_hour,
            color: req.body.color,
            start_time : req.body.start_time,
            duration: req.body.duration,
            description: req.body.description,
            type: req.body.type,
            calendar: req.body.calendar,
            userId: req.user?._id 
        });
        const savedTask = await task.save();
        console.log("Created Task")
        res.status(201).json(savedTask);
    } 
    catch (error) {
        console.error('Create task error:', error); 
        res.status(400).json({ message: 'Error creating task', error });
    }
}

export async function editTask(req: AuthRequest, res: Response){
    try{
        const task = await Task.findOneAndUpdate(
        { id: req.body.id, userId: req.user?._id },
        {
            id: req.body.id,
            title: req.body.title,
            day: req.body.day,
            date: req.body.date,
            start_hour: req.body.start_hour,
            color: req.body.color,
            start_time : req.body.start_time,
            duration: req.body.duration,
            description: req.body.description,
            type: req.body.type,
            calendar: req.body.calendar,
            userId: req.user?._id 
        },
        { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log("Edited Task")
        res.json(task);
    }
    catch(error){
        console.error('Edit task error:', error); 
        res.status(400).json({ message: 'Error updating task', error });
    }
}

export async function deleteTask(req: AuthRequest, res: Response){
    try{
        const taskId = req.query.id;
        const task = await Task.findOneAndDelete({id: taskId});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log("Deleted Task")
        res.json({ message: 'Task deleted successfully' });
    } 
    catch(error){
        console.error('Delete task error:', error); 
        res.status(500).json({ message: 'Error deleting task', error });
    }
}