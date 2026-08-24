require("dotenv").config();

const express = require("express");
const app = express();

const requestLogger = require("./middleware/logger");
const { globalErrorHandler, notFoundHandler } = require("./middleware/errorHandler");
const todosRouter = require("./routes/todos");

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running. Try GET /todos" });
});

app.use("/todos", todosRouter);

app.use(notFoundHandler);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API alive on port ${PORT}`);
});