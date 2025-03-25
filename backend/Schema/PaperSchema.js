import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  branch: { type: String, required: true },
  pages: { type: Number },
  fileName: { type: String, required: true },
  fileType:{type:String,require:true},
  publicId:{type:String,require:true},
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const paper = mongoose.model("paperSolution", paperSchema);
export default paper;
