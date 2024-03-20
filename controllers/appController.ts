/** @format */
import ApplicationModel from "../models/application";
import UserModel from "../models/user";
import { Request, Response, application } from "express";
const nodemailer = require("nodemailer");
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { jobID, candidateID }: any = req.body;

    let appCount = await ApplicationModel.countDocuments();

    let appID = "App001";

    if (appCount != 0) {
      if (appCount < 10) {
        appID = "App" + "00" + (appCount + 1);
      } else if (appCount < 100) {
        appID = "App" + "0" + (appCount + 1);
      } else {
        appID = "App" + (appCount + 1);
      }
    }

    let application = await ApplicationModel.create({
      appID: appID,
      jobID: jobID,
      candidateID: candidateID,
      status: "Applied",
    });

    if (application) {
      let addApplication = await UserModel.updateOne({ candidateID: candidateID }, { $push: { application: appID } });
    }

    //show success message here;
    res.json({ application });
  } catch (error: any) {
    console.log("Error in signup : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};

export const getAllApplication = async (req: Request, res: Response) => {
  try {
    //Get user with email and name exclude password
    let applications = await ApplicationModel.aggregate([{ $match: {} }]);

    //show success message here;
    res.json({ applications });
  } catch (error: any) {
    console.log("Error in finding all lecture : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    //Get user with email and name exclude password
    const { appID, status, reason }: any = req.body;

    let application = await ApplicationModel.findOne({ appID: appID });

    let user = await UserModel.findOne({ candidateID: application?.candidateID });

    let mailData = {
      from: process.env.EMAIL,
      to: user?.email,
      subject: `Status Updated`,
      html: `<p>Hello</p>
    <p> User your application status has been change and your new status is ${status}.</p>
      
    <p> Regards, </p>
    <p> Job Posting web app Ideamagix </p>
    `,
    };

    if (status == "Rejected") {
      if (reason == "") {
        return res.json({
          error: "Please write a reason",
        });
      }

      mailData = {
        from: process.env.EMAIL,
        to: user?.email,
        subject: `Status Updated`,
        html: `<p>Hello</p>
      <p> User your application has been ${status}.</p>
      <p> Reason</p>
      <p> ${reason} </p>
        
      <p> Regards, </p>
      <p> Job Posting web app Ideamagix </p>
      `,
      };
    }

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

    let updateStatus = await ApplicationModel.updateOne({ appID: appID }, { status: status, rejectedReason: reason });

    //show success message here;
    // res.json({ updateStatus });
  } catch (error: any) {
    console.log("Error in finding all lecture : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};
