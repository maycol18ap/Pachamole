import express from "express";
import cors from "cors";
import healthRouter from "./modules/health/health.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api", healthRouter);

export default app;
