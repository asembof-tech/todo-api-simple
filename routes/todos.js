const express = require("express");
const router = express.Router();
const Todo = require("../database/models/todomodels");
const AppError = require("../middleware/AppError");
const { validateCreate, validateUpdate } = require("../middleware/validator");

// GET /todos -- list all, optional ?completed=true/false filter
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    }
    const todos = await Todo.find(filter);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});

// GET /todos/:id
router.get("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      throw new AppError(`Todo with id ${req.params.id} not found`, 404);
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// POST /todos
router.post("/", validateCreate, async (req, res, next) => {
  try {
    const newTodo = await Todo.create({
      task: req.body.task,
      completed: req.body.completed || false,
    });
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

// PATCH /todos/:id
router.patch("/:id", validateUpdate, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      throw new AppError(`Todo with id ${req.params.id} not found`, 404);
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE /todos/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      throw new AppError(`Todo with id ${req.params.id} not found`, 404);
    }
    res.status(200).json({ message: "Deleted", todo });
  } catch (err) {
    next(err);
  }
});

module.exports = router;