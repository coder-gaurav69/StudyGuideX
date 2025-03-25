import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {upload,deleteFile} from "./cloudinary.js";
import { connectMONGODB } from "./mongoDB.js";
import paper from "./Schema/PaperSchema.js";

dotenv.config();

const app = express();
app.use(
  cors({ methods: ["POST", "GET", "DELETE"], origin:'*', credentials: true })
);
app.use(express.json());

const PORT = process.env.PORT || 2000;

// ✅ Test route
app.get("/", (req, res) => res.send("Welcome to the backend!"));

// ✅ Get all data
app.get("/getData", async (req, res) => {
  try {
    const wholeData = await paper.find();
    res.json({
      message: "Received successfully",
      status: "ok",
      statusCode: 200,
      data: wholeData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch",
      status: "not ok",
      statusCode: 400,
      error: error,
    });
  }
});

//Delete a file by ID , can also use endPoint like this "/delete/:publicId/:fileType/:id"
app.delete("/delete", async (req, res) => {
  
  const {id,publicId,fileType} = req.body;

  // const {publicId,fileType,id} = req.params;

  if (!id)
    return res
      .status(400)
      .json({ message: "ID is required", status: "not ok", statusCode: 400 });

  try {
    const deletedItem = await paper.findById({_id:id});
    if (!deletedItem)
      return res
        .status(404)
        .json({ message: "Item not found", status: "not ok", statusCode: 404 });

    // ye mongoDb se udayega
    await paper.deleteOne({ _id: id });

    // ye cloudinary(cloud service) se udayega
    await deleteFile(publicId,fileType);

    res.json({
      message: "Deleted successfully",
      status: "ok",
      statusCode: 200,
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete",
      status: "not ok",
      statusCode: 500,
      error: error.message,
    });
  }
});

// Post request for uploading file in moongoose and cloud service
app.post("/postData", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const [fileType, fileExtension] = req.file.mimetype.split("/");
  if (fileExtension === "mpeg" || fileExtension === "mp4") {
    return res.status(400).json({
      message: "Only pdf,jpg,jpeg,png allowed",
    });
  }

  try {
    const check = await paper.findOne({ fileName: req.file.originalname });
    if (check)
      return res.status(409).json({
        message: "Duplicate entry! File already exists.",
        status: "conflict",
        statusCode: 409,
      });

      const paperDocument = new paper({
        subject: req.body.subject,
        description: req.body.description,
        year: req.body.year,
        branch: req.body.branch,
        pages: req.body.pages,
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        fileType: req.file.mimetype.split("/")[0],
        publicId: req.file.filename,
      });

    const response = await paperDocument.save();
    res.json({
      message: "File sent successfully!",
      status: "ok",
      statusCode: 200,
      data: req.body,
      fileUrl: req.file.path,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "not ok",
      statusCode: 500,
      error: error.message,
    });
  }
});

// ✅ Connect to MongoDB
connectMONGODB();

// ✅ Start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
