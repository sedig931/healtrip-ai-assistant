import express from "express";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/chatRoute",chatRoute);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "HealTrip backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});