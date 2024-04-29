const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");
const User = require("../models/User")


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
     let tasklist = tasks;
   
    res.status(200).json({ tasklist, status: true, msg: "Tasks found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    res.status(200).json({ task, status: true, msg: "Task found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postTask = async (req, res) => {
  try {
    const {title, description,duedate } = req.body;
    if (!title ) {
      return res.status(400).json({ status: false, msg: "Title of task not found" });
    }
    const task = await Task.create({ user: req.user.id, title, description,duedate });

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { tasks: task._id } },
      { new: true }
    );
    res.status(200).json({ task, status: true, msg: "Task created successfully.." });

  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.putTask = async (req, res) => {
  try {
    const {title, description, duedate, status } = req.body;
    // if (!description) {
    //   return res.status(400).json({ status: false, msg: "Description of task not found" });
    // }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update task of another user" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, duedate, status },
      { new: true }
    );
    res.status(200).json({ task, status: true, msg: "Task updated successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}


exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
     const user = await User.findById(req.user._id);
       const index = user.tasks.indexOf(req.params.id);
       user.tasks.splice(index, 1);
       await user.save();
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}