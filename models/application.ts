/** @format */

import mongoose from "mongoose";
const { Schema } = mongoose;

const Application = new Schema({
  appID: { type: String },
  jobID: { type: String },
  candidateID: { type: String },
  status: { type: String },
  rejectedReason: { type: String },
});

const ApplicationModel = mongoose.model("Application", Application);
export default ApplicationModel;
