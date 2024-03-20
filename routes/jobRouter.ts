/** @format */

import express from "express";
import dotenv from "dotenv";
import { createJob, getAllJobs } from "../controllers/jobController";
dotenv.config();

const router = express.Router();

router.post("/createJob", createJob);
router.post("/getAllJobs", getAllJobs);

export = router;
