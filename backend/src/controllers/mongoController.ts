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
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
}

export async function createTask(req: AuthRequest, res: Response){
    console.log(req.body)
    try{
        const task = new Task({
            id: req.body.id,
            title: req.body.title,
            date: req.body.day,
            start_time : req.body.start_time,
            duration: req.body.duration,
            description: req.body.description,
            type: req.body.type,
            calender: req.body.calender,
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
        { _id: req.params.id, userId: req.user?._id },
        {
            id: req.body.id,
            title: req.body.title,
            date: req.body.day,
            start_time : req.body.start_time,
            duration: req.body.duration,
            description: req.body.description,
            type: req.body.type,
            calender: req.body.calender,
            userId: req.user?._id 
        },
        { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    }
    catch(error){
        res.status(400).json({ message: 'Error updating task', error });
    }
}

export async function deleteTask(req: AuthRequest, res: Response){
    try{
        const taskId = req.query.id;
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } 
    catch(error){
        res.status(500).json({ message: 'Error deleting task', error });
    }
}