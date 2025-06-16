import express from "express";
import connectDB from "./config/DB.config";
import Env from "./config/Env.config";
import responseHandlers from "./services/response/response.service";
import globalRouter from "./routes/app/indec";


const app = express();

// 🔹 Middleware


// app.use(bodyParser.json()); // ✅ Use this instead
// app.use(express.urlencoded({ extended: true }));

// Sample Route
app.get("/api/hello", async (req:any, res:any) => {
  await connectDB();
  res.send(JSON.stringify({ message: `Stage: ${Env.NODE_ENV}` }));
});


(async () => {
  await connectDB(); // Only once on app startup
})();
app.use("/api",globalRouter)
app.use(responseHandlers.globalErrorHandler);

export default app;
