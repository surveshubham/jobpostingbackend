/** @format */

import mongoose from "mongoose";
const { Schema } = mongoose;

const User = new Schema({
  candidateID: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  type: { type: String },
  application: [{ type: String }],
  resumePath: { type: String }
});

const UserModel = mongoose.model("User", User);
export default UserModel;
