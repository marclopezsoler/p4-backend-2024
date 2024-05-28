import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ ok: "true", message: "hello" });
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`My api listens on: http://localhost:${PORT}`);
});