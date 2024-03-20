/** @format */

import express from "express";
import dotenv from "dotenv";
import { createApplication, getAllApplication, updateStatus } from "../controllers/appController";
dotenv.config();

const router = express.Router();

router.post("/createApplication", createApplication);
router.post("/getAllApplication", getAllApplication);
router.post("/updateStatus", updateStatus);

export = router;
