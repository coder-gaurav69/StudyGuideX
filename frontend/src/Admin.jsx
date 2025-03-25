import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";

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
      // console.log(msg)
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <button
        className="mb-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={() => navigate("/showData")}
      >
        Show Details
      </button>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Admin Panel
        </h1>

        <form onSubmit={handleForm} className="flex flex-col gap-4">
          {["subject", "branch", "year", "description", "pages"].map(
            (field, index) => (
              <div key={index} className="flex flex-col">
                <label htmlFor={field} className="text-gray-700 font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  required
                  type="text"
                  name={field}
                  id={field}
                  className="inputField w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(val) => {
                    if (field === "subject") setSubject(val.target.value);
                    else if (field === "branch") setBranch(val.target.value);
                    else if (field === "year") setYear(val.target.value);
                    else if (field === "description")
                      setDescription(val.target.value);
                    else if (field === "pages") setPages(val.target.value);
                  }}
                />
              </div>
            )
          )}

          <div className="flex flex-col items-center gap-2">
            <label className="text-gray-700 font-medium">Upload File:</label>
            <label
              htmlFor="fileField"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
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
              <p className="text-sm text-gray-600">Selected: {file.name}</p>
            )}
          </div>

          {message && (
            <div className="text-center text-red-500 font-semibold">
              {message}
            </div>
          )}

          {loader && <Loader />}

          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg text-lg font-medium hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
