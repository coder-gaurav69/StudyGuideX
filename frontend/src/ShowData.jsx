import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowData = () => {
  const [data, setData] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {

      const url = `${import.meta.env.VITE_API_BACKEND_URL}/delete`;

      // in this passing data in the form of url
      // const url = `${import.meta.env.VITE_API_BACKEND_URL}/delete/${encodeURIComponent(deleteItem.publicId)}/${encodeURIComponent(deleteItem.fileType)}/${encodeURIComponent(deleteItem._id)}`;

      // console.log(url);
      await axios.delete(url, {
        data: {
          id: deleteItem._id,
          publicId: deleteItem.publicId,
          fileType: deleteItem.fileType,
        },
      });
      setData((prev) => prev.filter((e) => e._id !== deleteItem._id));
      setDeleteItem(null);
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BACKEND_URL}/getData`;
        const response = await axios.get(url);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (deleteItem) {
      handleDelete();
    }
  }, [deleteItem]);

  useEffect(() => {
    console.log(import.meta.env.VITE_API_BACKEND_URL);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-5">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">All Data</h1>
        <button
          className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <div className="mt-6 space-y-4">
          {data &&
            data.map((e, id) => (
              <div
                key={id}
                className="p-4 bg-gray-50 rounded-lg shadow-md border relative"
              >
                <button
                  className="absolute top-2 right-2  text-white p-1 rounded-full hover:scale-150 duration-300 ease-in-out"
                  onClick={() => setDeleteItem(e)}
                >
                  ❌
                </button>
                <p className="text-lg font-medium">Subject: {e.subject}</p>
                <p>Branch: {e.branch}</p>
                <p>Description: {e.description}</p>
                <p>Year: {e.year}</p>
                <p>No. of Pages: {e.pages}</p>
                <p>FileName: {e.fileName}</p>

                {/* {e.fileName.endsWith(".mp4") && (
                <video src={e.fileUrl} className="w-full mt-2 rounded-lg" controls />
              )}
              {e.fileName.endsWith(".mp3") && (
                <audio src={e.fileUrl} className="w-full mt-2" controls />
              )} */}
                {!["pdf"].includes(e.fileName.split(".").pop()) && (
                  <img
                    src={e.fileUrl}
                    alt="uploaded file"
                    className="w-full mt-2 rounded-lg"
                  />
                )}
                {e.fileName.endsWith(".pdf") && (
                  <iframe
                    src={e.fileUrl}
                    width="100%"
                    height="400px"
                    className="mt-2"
                  ></iframe>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShowData;
