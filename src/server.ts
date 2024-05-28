import cors from "cors";
import express from "express";
import morgan from "morgan";
import productsRouter from "./products";
import ordersRouter from "./orders";
import { defaultErrorHandler } from "./errors";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/products", productsRouter);

app.use("/orders", ordersRouter);

app.use(defaultErrorHandler);

app.get("/", async (req, res) => {
  res.status(200).json({ ok: "true", message: "hello" });
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`My api listens on: http://localhost:${PORT}`);
});
