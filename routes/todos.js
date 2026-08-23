const express = require("express");
const router = express.Router();
const AppError = require("../middleware/AppError");
const { validateCreate, validateUpdate } = require("../middleware/validator");

// In-memory store
let todos = [
  { id: 1, task: "Learn Express", completed: false },
  { id: 2, task: "Learn Joi validation", completed: false },
];
let nextId = 3;

// GET /todos -- list all
router.get("/", (req, res) => {
  res.status(200).json(todos);
});

// GET /todos/:id -- get one (try/catch #1)
router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      throw new AppError(`Todo with id ${id} not found`, 404);
    }

    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// POST /todos -- create (validated: task min 3 chars)
router.post("/", validateCreate, (req, res, next) => {
  try {
    const newTodo = {
      id: nextId++,
      task: req.body.task,
      completed: req.body.completed || false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

// PATCH /todos/:id -- partial update (validated: task min 3 chars if provided) (try/catch #2)
router.patch("/:id", validateUpdate, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      throw new AppError(`Todo with id ${id} not found`, 404);
    }

    Object.assign(todo, req.body); // merge, e.g. {completed: true}
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE /todos/:id (try/catch #3)
router.delete("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new AppError(`Todo with id ${id} not found`, 404);
    }

    const deleted = todos.splice(index, 1);
    res.status(200).json({ message: "Deleted", todo: deleted[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
