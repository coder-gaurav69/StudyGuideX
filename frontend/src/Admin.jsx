import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx";
import subjectList from "./subectList.json";

const Admin = () => {
  const [files, setFiles] = useState([null, null]);
  const [year, setYear] = useState(null);
  const [branch, setBranch] = useState(null);
  const [subject, setSubject] = useState(null);
  const [semester, setSemester] = useState(null);
  const [paperCategory, setPaperCategory] = useState(null);
  const [message, setMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoader(true);

    try {
      // Validate files
      if (!files[0] || !files[1]) {
        setMessage("Please select both files");
        setLoader(false);
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/tiff",
      ];

      for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
          setMessage(
            "Only PDF or image files (JPEG, PNG, JPG, etc.) are allowed"
          );
          setFiles([null, null]);
          setLoader(false);
          return;
        }
      }

      const url = `${import.meta.env.VITE_API_BACKEND_URL}/postData`;
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("branch", branch);
      formData.append("year", year);
      formData.append("semester", semester);
      formData.append("paperCategory", paperCategory);
      formData.append("questionPaper", files[0]);
      formData.append("paperSolution", files[1]);

      const result = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(result.data?.message);
      setLoader(false);
      handleMessage();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred during upload"
      );
      setLoader(false);
    }
  };

  const handleMessage = () => {
    setTimeout(() => {
      setMessage(null);
      setBranch(null);
      setSemester(null);
      setSubject(null);
      setYear(null);
      setFiles([null, null]);
      setPaperCategory(null);

      
      ['subject','year','branch','semester','category','fileField0','fileField1'].forEach((e)=>{
        document.getElementById(e).value = '';
      })

    }, 3000);
  };

  const handleFileChange = (e) => {
    const index = parseInt(e.target.dataset.key);
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/tiff",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage(
          "Please select only PDF or image files (JPEG, PNG, JPG, etc.)"
        );
        const newFiles = [...files];
        newFiles[index] = null;
        setFiles(newFiles);
        e.target.value = "";
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage("File size must be under 10MB.");
        const newFiles = [...files];
        newFiles[index] = null;
        setFiles(newFiles);
        e.target.value = "";
        return;
      }

      const newFiles = [...files];
      newFiles[index] = selectedFile;
      setFiles(newFiles);
      setMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <button
          className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium 
            hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
          onClick={() => navigate("/showData")}
        >
          <span className="relative z-10">Show Details</span>
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100/50">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Admin Dashboard
          </h1>

          <form onSubmit={handleForm} className="space-y-6">

            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="branch"
               className="block text-sm font-medium text-gray-700 capitalize"
              >
                Branch:
              </label>
              <select
                id="branch"
                name="branch"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 text-gray-800"
                onChange={(e) => setBranch(e.target.value)}
                defaultValue=''
              >
                <option value="" disabled>
                  Select Branch
                </option>
                <option value="CSE">Computer Science</option>
                <option value="IT">IT</option>
                <option value="ECE">Electronics & Communication</option>
              </select>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="semester"
               className="block text-sm font-medium text-gray-700 capitalize"
              >
                Semester:
              </label>
              <select
                id="semester"
                name="semester"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 text-gray-800"
                onChange={(e) => setSemester(e.target.value)}
                defaultValue=''
              >
                <option value="" disabled>
                  Select Semester
                </option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                Subject:
              </label>
              {
                <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-200 text-gray-800"
                onChange={(e) => setSubject(e.target.value)}
                defaultValue=''
              >
                <option value="" defaultChecked disabled>
                  Select Subject
                </option>
              
                {subjectList?.[branch]?.[semester]?.map((e, index) => (
                  <option value={e} key={index}>
                    {e}
                  </option>
                ))}
              </select>
              
              }
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 capitalize">
                Previous Year:
              </label>
              <select
                id="year"
                name="year"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 text-gray-800"
                onClick={(e)=>setYear(e.target.value)}
                defaultValue=''
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                
              </select>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                PaperCategory
              </label>
              <select
                name="category"
                id="category"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 text-gray-800"
                onChange={(e) => setPaperCategory(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select Exam Type --
                </option>
                <option value="Mid Term Paper">Mid Term Paper</option>
                <option value="End Term Paper">End Term Paper</option>
              </select>
            </div>

            {["Question Paper", "Solution"].map((label, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload {label} (PDF or Image only)
                </label>
                <div className="relative">
                  <label
                    htmlFor={`fileField${index}`}
                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 
                      text-white rounded-xl cursor-pointer hover:from-blue-600 hover:to-indigo-600 
                      transition-all duration-200 shadow-md"
                  >
                    Choose File
                  </label>
                  <input
                    id={`fileField${index}`}
                    type="file"
                    className="hidden"
                    data-key={index}
                    accept=".pdf,image/jpeg,image/png,image/jpg,image/gif,image/bmp,image/webp,image/tiff"
                    onChange={handleFileChange}
                    required
                  />
                  {files[index] && (
                    <p className="mt-2 text-sm text-gray-600 truncate max-w-xs">
                      Selected: {files[index].name}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {message && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                {message}
              </div>
            )}

            {loader && <Loader />}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl"
            >
              {loader ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
