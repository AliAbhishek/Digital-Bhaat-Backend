import express from "express";
import connectDB from "./config/DB.config";
import Env from "./config/Env.config";
import responseHandlers from "./services/response";

const app = express();

// 🔹 Middleware
app.use(express.json()); // To parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Sample Route
app.get("/api/hello", async (req:any, res:any) => {
  await connectDB();
  res.send(JSON.stringify({ message: `Stage: ${Env.NODE_ENV}` }));
});

app.use(responseHandlers.globalErrorHandler);

export default app;
