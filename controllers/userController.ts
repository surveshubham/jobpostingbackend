/** @format */
import JobModel from "../models/jobs";
import UserModel from "../models/user";
import { Request, Response, text } from "express";
const nodemailer = require("nodemailer");
const PDFParser = require("pdf-parse");
const fs = require("fs");


export const createUser = async (req: any, res: Response) => {
  try {
    const { name, email, password, type }: any = req.body;

    const resumePath = req.file.path;

    let user = await UserModel.findOne({ email: email });

    if (user) {
      return res.json({
        error: "A User with this email already exists. Please try again with a different email.",
      });
    }

    if (type == "Candidate") {
      let userCount = await UserModel.countDocuments();

      let userID = "Can001";

      if (userCount != 0) {
        if (userCount < 10) {
          userID = "Can" + "00" + (userCount + 1);
        } else if (userCount < 100) {
          userID = "Can" + "0" + (userCount + 1);
        } else {
          userID = "Can" + (userCount + 1);
        }
      }

      user = await UserModel.create({
        candidateID: userID,
        name: name,
        email: email,
        password: password,
        type: type,
        resumePath
      });
    } else if (type == "Admin") {
      user = await UserModel.create({
        name: name,
        email: email,
        password: password,
        type: type,
        resumePath
      });
    }

    //show success message here;
    res.json({ user });
  } catch (error: any) {
    console.log("Error in create User : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: any = req.body;

    let user = await UserModel.find({ email: email, password: password });

    if (!user) {
      return res.json({
        error: "User credentials did not match",
      });
    }

    //show success message here;
    res.json({ user });
  } catch (error: any) {
    console.log("Error in Login : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};

export const forgotPassUser = async (req: Request, res: Response) => {
  try {
    const { email }: any = req.body;

    let user = await UserModel.find({ email: email });

    if (!user) {
      return res.json({
        error: "User credentials did not match",
      });
    }

    if (user) {
      let newPass = Math.random().toString(36).slice(2, 10);
      let updateUserPass = await UserModel.updateOne({ email: email }, { password: newPass });

      //send Mail;
      const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Configuring Mail Data
      const mailData = {
        from: process.env.EMAIL,
        to: email,
        subject: `Request for password change`,
        html: `<p>Hello</p>
    <p> User your password has been change and your new password is ${newPass}.</p>
      
    <p> Regards, </p>
    <p> Job Posting web app Ideamagix </p>
    `,
      };

      await new Promise((resolve, reject) => {
        transporter.sendMail(mailData, (err: any, info: any) => {
          if (err) {
            console.error(err);
            reject(err);
            res.status(500).json({
              success: "false",
              error: err,
            });
          } else {
            resolve(info);
            res.status(200).json({
              success: "true",
              info,
              error: err,
            });
          }
        });
      });

      //show success message here;
      //   res.json({ updateUserPass });
    }
  } catch (error: any) {
    console.log("Error in Login : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};



export const matchPdf = async (req: Request, res: Response) => {
  try {
    const { canID, jobID }: any = req.body;


    let user = await UserModel.find({ candidateID: canID });

    if (!user) {
      return res.json({
        error: "User credentials did not match",
      });
    }

    let job = await JobModel.find({ jobID: jobID });

    if (!job) {
      return res.json({
        error: "job  did not exsits",
      });
    }

    let pdfFilePath = user[0].resumePath;
    let skillsList = job[0].skills;

    // / Function to extract skills from text
    function extractSkills(text: any) {
      const extractedSkills: string[] = [];
      skillsList.forEach(skill => {
        if (text.toLowerCase().includes(skill.toLowerCase())) {
          console.log("the matching skills was " + skill)

          extractedSkills.push(skill);
        }
      });

      let percentageMatch = (100 * extractedSkills.length) / skillsList.length

      res.json({extractedSkills , percentageMatch});

    }

    // Parse PDF and extract skills
    fs.readFile(pdfFilePath, async (err: any, pdfBuffer: any) => {
      if (err) {
        console.error("Error reading PDF:", err);
        return;
      }

      const pdfText = await PDFParser(pdfBuffer);
      const extractedSkills = extractSkills(pdfText.text);
    });




  }

  catch (error: any) {
    console.log("Error in MatchPdf : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
}