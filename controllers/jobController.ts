/** @format */

import JobModel from "../models/jobs";
import { Request, Response } from "express";

//create a new instructor
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, category, jobType, company, details, tags, skills, expReq, salary, additionalField }: any = req.body;

    let jobCount = await JobModel.countDocuments();

    let jobID = "Job001";

    if (jobCount != 0) {
      if (jobCount < 10) {
        jobID = "Job" + "00" + (jobCount + 1);
      } else if (jobCount < 100) {
        jobID = "Job" + "0" + (jobCount + 1);
      } else {
        jobID = "Job" + (jobCount + 1);
      }
    }

    let job = await JobModel.create({
      jobID: jobID,
      title: title,
      category: category,
      jobType: jobType,
      company: company,
      details: details,
      tags: tags,
      skills: skills,
      expReq: expReq,
      salary: salary,
      additionalField: additionalField,
    });

    //show success message here;
    res.json({ job });
  } catch (error: any) {
    console.log("Error in signup : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    //Get user with email and name exclude password
    let jobs = await JobModel.aggregate([{ $match: {} }]);

    //show success message here;
    res.json({ jobs });
  } catch (error: any) {
    console.log("Error in finding all lecture : ", error.toString());
    res.sendStatus(500).json({ error: "Something went wrong, please try again later" });
    return;
  }
};
