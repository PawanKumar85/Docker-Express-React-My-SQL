import express from "express";
import taskRoutes from "./routes/task.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const path = (req, res, next) => {
  console.log(`${req.method} :: ${req.url}`);
  next();
};

app.use(path);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Express application using My-SQL and Docker",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
