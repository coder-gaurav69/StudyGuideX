import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { upload, deleteFile } from "./cloudinary.js";
import { connectMONGODB } from "./mongoDB.js";
import paper from "./Schema/PaperSchema.js";

dotenv.config();

const app = express();
app.use(cors({ methods: ["POST", "GET", "DELETE"], origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 2000;

// test request hai check karne ke lia server ko
app.get("/", (req, res) => res.send("Welcome to the backend!"));



// get request prapt karne ke lia data ko
app.get("/getData/:subject", async (req, res) => {
  try {
    const subject = req.params.subject;
    // console.log(subject)
    if(subject != 'fullData'){
      const particularSubjectData = await paper.find({subject});
      res.json({ message: "Received successfully", status: "ok", statusCode: 200, data: particularSubjectData });
      return;
    }else{
      const wholeData = await paper.find();
      res.json({ message: "Received successfully", status: "ok", statusCode: 200, data: wholeData });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch", status: "not ok", statusCode: 400, error: error.message });
  }
});

// Delete request banayi hai delte karne ke lia
app.delete("/delete", async (req, res) => {
  const {id,questionPaper,paperSolution} = req.body;

  if (!id) return res.status(400).json({ message: "ID is required", status: "not ok", statusCode: 400 });

  try {
    const deletedItem = await paper.findById({ _id: id });
    if (!deletedItem) return res.status(404).json({ message: "Item not found", status: "not ok", statusCode: 404 });

    await paper.deleteOne({ _id: id });

    [{publicId:questionPaper.publicId,fileType:questionPaper.fileType},{publicId:paperSolution.publicId,fileType:paperSolution.fileType}].forEach(async ({publicId,fileType})=>{
      await deleteFile(publicId,fileType);
    })

    res.json({ message: "Deleted successfully", status: "ok", statusCode: 200, data: deletedItem });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete", status: "not ok", statusCode: 500, error: error.message });
  }
});

//Post request banayi hai upload ke lia
app.post("/postData", upload.fields([{ name: "questionPaper" }, { name: "paperSolution" }]), async (req, res) => {
  try {

    if (!req.files?.questionPaper || !req.files?.paperSolution) {
      return res.status(400).json({ message: "Both files are required", status: "not ok", statusCode: 400 });
    }

    const { subject, year, branch, semester , paperCategory } = req.body;
    const questionPaper = req.files.questionPaper[0];
    const paperSolution = req.files.paperSolution[0];

    // check karenge ki filename exist karti hai ya nahi
    if (!questionPaper.filename || !paperSolution.filename) {
      return res.status(400).json({ message: "Upload failed. Missing file identifiers.", status: "not ok", statusCode: 400 });
    }

    // ensure MongoDB receives correct values
    const paperData = {
      subject,
      year,
      branch,
      semester,
      paperCategory,
      questionPaper: {
        fileName: questionPaper.originalname,
        fileUrl: questionPaper.path,
        fileType: questionPaper.mimetype.split("/")[0],
        publicId: questionPaper.filename,
      },
      paperSolution: {
        fileName: paperSolution.originalname,
        fileUrl: paperSolution.path,
        fileType: paperSolution.mimetype.split("/")[0],
        publicId: paperSolution.filename,
      },
    };

    // Check for duplicates before inserting
    const existingPaper = await paper.findOne({paperCategory,branch,subject,year});
    // console.log(existingPaper)

    if (existingPaper) {
      return res.status(409).json({ message: "Duplicate entry! Files already exist.", status: "conflict", statusCode: 409 });
    }

    // Insert document
    const paperDocument = new paper(paperData);
    await paperDocument.save();

    return res.json({ message: "Files uploaded successfully!", status: "ok", statusCode: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Internal Server Error", status: "not ok", statusCode: 500, error: error.message });
  }
});




// mongoDb se connect karenge
connectMONGODB();

// server bana lia
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
