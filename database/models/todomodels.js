const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, "task is required"],
    minlength: [3, "task must be at least 3 characters long"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const todoModel = mongoose.model("Todo", todoSchema);

module.exports = todoModel;