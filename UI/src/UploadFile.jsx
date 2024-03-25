/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import Loader from "./Loader";
import axios from "axios";

const UploadFile = ({ handleUploadedFileName, updateChat }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleUploadedFileName(file.name);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile && isExcelOrCSVFile(selectedFile.name)) {
      // Perform file upload logic here
      console.log("Uploading file:", selectedFile.name);
      setShowLoader(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      if (response.status === 200 && response.data?.filename === selectedFile.name) {      
        updateChat();
        setShowLoader(false);
        handleUploadedFileName(null);
      } 
      } catch (error) {
        console.log("Error uploading file");
        setShowLoader(false);
        setErrorMessage("Error uploading file");
      }
      
    } else {
      console.log("No file selected");
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    handleUploadedFileName(file.name);
    setSelectedFile(file);
  };

  function isExcelOrCSVFile(fileName) {
    const fileExtension = fileName.split('.').pop();
    return fileExtension === 'xlsx' || fileExtension === 'csv';
  }

  return (
    <div
      className={`w-[100%] pt-4 ${dragging ? "border-2 border-dashed border-gray-500" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-center font-bold sm:text-lg w-fit mx-auto">Upload a CSV/Excel File</h3>
      <div className="flex flex-col mx-auto items-center w-[90%] max-w-[20rem] py-6 h-[12rem] rounded-[20px] mt-4 bg-[#5356FF]">
        {showLoader && <Loader />}
        <label
          htmlFor="file-upload"
          className="flex items-center cursor-pointer font-bold gap-2"
        >
          <FaFileUpload size={20} /> Choose/Drop File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />
        {selectedFile && (
          <p className="text-gray-100 mt-4 font-medium w-[90%] text-center break-words mx-auto">{selectedFile.name}</p>
        )}
        <button
          onClick={handleUpload}
          className="bg-black mt-4 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-[10px]"
        >
          Upload
        </button>
        {selectedFile && !isExcelOrCSVFile(selectedFile.name) && (
          <p className="text-red-500 mt-2">Invalid file format</p>
        )}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default UploadFile;