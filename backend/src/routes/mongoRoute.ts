import express from "express"
import * as Mongo from "../controllers/mongoController"
import { isAuthenticated } from '../middleware/auth';

const mongoRouter = express.Router();

mongoRouter.use(isAuthenticated)

// get all of tasks for user
// id --> user id
mongoRouter.get("/getAllTasks", Mongo.getUserTasks);

// get specific task
// id --> task _id
mongoRouter.get("/getTask", Mongo.getTask);

// create task
/*
title: req.body.title,
date: req.body.date,
start_time : req.body.start_time,
end_time: req.body.end_time,
description: req.body.description,
completed: req.body.completed,
type: req.body.type,
userId: req.body.userId
*/
mongoRouter.post("/createTask", Mongo.createTask);

// edit task
mongoRouter.post("/editTask", Mongo.editTask)

// delete task
// id --> task _id
mongoRouter.get("/deleteTask", Mongo.deleteTask);

export default mongoRouter;

