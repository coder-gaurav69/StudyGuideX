import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowData = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (item) => {
    try {
      const url = `${import.meta.env.VITE_API_BACKEND_URL}/delete`;
      await axios.delete(url, {
        data: {
          id:item._id,
          questionPaper:item.questionPaper,
          paperSolution: item.paperSolution,
        },
      });
      setData((prev) => prev.filter((e) => e._id !== item._id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BACKEND_URL}/getData/fullData`;
        const response = await axios.get(url);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              All Resources
            </h1>
            <button
              className="text-[14px] sm:text-[16px] group relative px-3 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 
                transition-all duration-300 shadow-md"
              onClick={() => navigate("/")}
            >
              <span className="relative z-10">Back to Home</span>
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>

          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No data available
              </div>
            ) : (
              data.map((e) => (
                <div
                  key={e._id}
                  className="relative bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <button
                    className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 bg-red-500 
                      text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-sm 
                      hover:scale-110"
                    onClick={() => handleDelete(e)}
                    title="Delete item"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-5">
                      <h2 className="text-md  font-semibold text-gray-800">
                        {e.subject}
                      </h2>
                      <div className="text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Branch:</span> {e.branch}
                        </p>
                        <p>
                          <span className="font-medium">Semester:</span> {e.semester}
                        </p>
                        <p>
                          <span className="font-medium">Year:</span> {e.year}
                        </p>
                      </div>
                    </div>

                    {["questionPaper", "paperSolution"].map((val, index) => {
                      const fileType = e[val]?.fileName?.split(".").pop();
                      return (
                        <div className="mt-4 md:mt-0" key={index}>
                          {fileType && fileType !== "pdf" && (
                            <img
                              src={e[val].fileUrl}
                              alt="uploaded file"
                              className="w-full h-64 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          {fileType === "pdf" && (
                            <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-sm">
                              <iframe
                                src={e[val].fileUrl}
                                width="100%"
                                height="100%"
                                className="absolute inset-0"
                                title={e[val].fileName}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
