const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duedate: {
      type: Date,
    },
    status: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], 
      default: "medium", 
    },
  },
  {
    timestamps: true,
  }
);


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;