/** @format */
import express from "express";
import dotenv from "dotenv";
import { getUser, forgotPassUser, createUser , matchPdf } from "../controllers/userController";
const multer = require('multer');
import path from 'path';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req : any, file : any, cb : any) {
    cb(null, '../jobPostingFrontend/frontend/public');
  },
  filename: function (req :any, file : any, cb : any) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 } // Limit file size to 10MB
}).single('resume'); // 'resume' is the name attribute of your file input field

dotenv.config();

const router = express.Router();

router.post("/createUser", upload ,createUser);
router.post("/getUser", getUser);
router.post("/forgotPassUser", forgotPassUser);
router.post("/matchpdf",matchPdf)

export = router;
