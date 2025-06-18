import express from "express";
import connectDB from "./config/DB.config";
import Env from "./config/Env.config";
import responseHandlers from "./services/response/response.service";
import globalRouter from "./routes/app/indec";
import { globalRateLimiter } from "./middlewares/rateLImiting.middleware";


const app = express();

// 🔹 Middleware
app.use(globalRateLimiter);
app.use((req, res, next): any => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

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
