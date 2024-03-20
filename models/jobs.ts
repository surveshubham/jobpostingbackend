/** @format */

import mongoose from "mongoose";
const { Schema } = mongoose;

const Job = new Schema({
  jobID: { type: String },
  title: { type: String },
  category: { type: String },
  jobType: [{ type: String }],
  company: { type: String },
  details: { type: String },
  tags: [{ type: String }],
  skills: [{ type: String }],
  expReq: { type: String },
  salary: { type: String },
  additionalField: [{ type: Object }],
});

const JobModel = mongoose.model("Job", Job);
export default JobModel;
