import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, project: "Pachamole" });
});

app.listen(3000, () => {
  console.log("API disponible en http://localhost:3000");
});