import express from "express";
import authRouter from "./app/routes/auth.route.js";
import jobRouter from "./app/routes/job.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/jobs", jobRouter);

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
