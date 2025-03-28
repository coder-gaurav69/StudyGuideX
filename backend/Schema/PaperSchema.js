import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  paperCategory :{ type: String, required: true },
  questionPaper: {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
  },
  paperSolution: {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
  },
});

const paper = mongoose.model("paperSolution", paperSchema);

export default paper;
