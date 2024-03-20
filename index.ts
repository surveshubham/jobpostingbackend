/** @format */

import express, { Express, Request, Response } from "express";
import { connectToMongo } from "./db";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/userRouter";
import jobRouter from "./routes/jobRouter";
import appRouter from "./routes/appRouter";

import cors from "cors";
const app: Express = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//User Api
app.use("/api4", userRouter);

//job Api
app.use("/api5", jobRouter);

//Application Api
app.use("/api6", appRouter);

async function bootstrap() {
  await connectToMongo();
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

bootstrap();
