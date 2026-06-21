import express from "express";
import authRouter from "./app/routes/auth.route.js";
import jobRouter from "./app/routes/job.route.js";
import applicationRouter from "./app/routes/application.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/jobs", jobRouter);
app.use("/applications", applicationRouter);

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
