import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from './Loader.jsx'

const Admin = () => {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(null);
  const [branch, setBranch] = useState(null);
  const [subject, setSubject] = useState(null);
  const [description, setDescription] = useState(null);
  const [pages, setPages] = useState(null);
  const [message, setMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      setMessage(null);
      setLoader(true);
      const url = `${import.meta.env.VITE_API_BACKEND_URL}/postData`;
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("branch", branch);
      formData.append("year", year);
      formData.append("description", description);
      formData.append("pages", pages);
      if (file) formData.append("file", file);
      const result = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const msg = result.data?.message;
      setMessage(msg);
      setLoader(false);
      handleMessage();
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      setMessage(errorMsg);
      setLoader(false);
    }
  };

  const handleMessage = () => {
    setTimeout(() => {
      setMessage(null);
      setBranch(null);
      setDescription(null);
      setPages(null);
      setSubject(null);
      setDescription(null);
      setFile(null);
  
      const fileInput = document.getElementById("fileField");
      if (fileInput) fileInput.value = "";
  
      document.querySelectorAll(".inputField").forEach((e) => {
        e.value = "";
      });
    }, 3000);
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
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100/50">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Admin Dashboard
          </h1>

          <form onSubmit={handleForm} className="space-y-6">
            {["subject", "branch", "year", "description", "pages"].map((field, index) => (
              <div key={index} className="space-y-2">
                <label 
                  htmlFor={field} 
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {field}
                </label>
                <input
                  required
                  type="text"
                  name={field}
                  id={field}
                  className="inputField w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 text-gray-800 placeholder-gray-400"
                  placeholder={`Enter ${field}`}
                  onChange={(val) => {
                    if (field === "subject") setSubject(val.target.value);
                    else if (field === "branch") setBranch(val.target.value);
                    else if (field === "year") setYear(val.target.value);
                    else if (field === "description") setDescription(val.target.value);
                    else if (field === "pages") setPages(val.target.value);
                  }}
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload File
              </label>
              <div className="relative">
                <label
                  htmlFor="fileField"
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 
                    text-white rounded-xl cursor-pointer hover:from-blue-600 hover:to-indigo-600 
                    transition-all duration-200 shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0116 8a5 5 0 014 4.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose File
                </label>
                <input
                  id="fileField"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600 truncate max-w-xs">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center
                animate-in fade-in zoom-in-95 duration-300">
                {message}
              </div>
            )}

            {loader && <Loader />}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl
                font-medium hover:from-green-600 hover:to-emerald-600 transform hover:-translate-y-1 
                transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loader}
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