const Joi = require("joi");

// task must be a string, min 3 chars
const createTodoSchema = Joi.object({
  task: Joi.string().trim().min(3).required().messages({
    "string.min": "task must be at least 3 characters long",
    "string.empty": "task is required",
    "any.required": "task is required",
  }),
  completed: Joi.boolean().optional(),
});

// PATCH: task optional (partial update) but still min 3 chars if present
const updateTodoSchema = Joi.object({
  task: Joi.string().trim().min(3).messages({
    "string.min": "task must be at least 3 characters long",
    "string.empty": "task cannot be empty",
  }),
  completed: Joi.boolean(),
}).min(1); // must update at least one field

function validateCreate(req, res, next) {
  const { error, value } = createTodoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "ValidationError", message: error.details[0].message });
  }
  req.body = value;
  next();
}

function validateUpdate(req, res, next) {
  const { error, value } = updateTodoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "ValidationError", message: error.details[0].message });
  }
  req.body = value;
  next();
}

module.exports = { validateCreate, validateUpdate };
