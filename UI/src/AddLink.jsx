/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import { FaLink } from "react-icons/fa";
import Loader from "./Loader";
import axios from "axios";

const AddLink = ({ handleAddedLink, handleUploadedFileName, updateChat }) => {
  const [link, setLink] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLinkChange = (event) => {
    const link = event.target.value;
    handleAddedLink(link);
    handleUploadedFileName(null);
    setLink(link);
  };

  const handleUpload = async () => {
    if (link && isValidGoogleSheetsLink(link)) {
      console.log("Adding Link:", link);
      setShowLoader(true);
      const formData = new FormData();
      formData.append("sheet_link", link.trim());
      try {
        const response = await axios.post(
          "http://localhost:8000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
        if (response.status === 200) {
          updateChat();
          setShowLoader(false);
          handleAddedLink(null);
        }
      } catch (error) {
        console.log("Error uploading file");
        setShowLoader(false);
        setErrorMessage("Error uploading file");
      }
    } else {
      console.log("Invalid Google Sheets link");
    }
  };

  const isValidGoogleSheetsLink = (link) => {
    return link.startsWith("https://docs.google.com/spreadsheets");
  };

  const toggleInputVisibility = () => {
    setShowInput(!showInput);
    if (!showInput) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  };

  return (
    <div className="w-[100%] pt-4">
      <h3 className="text-center font-bold sm:text-lg w-fit mx-auto">
        Add a Google Sheet Link
      </h3>
      <div className="flex flex-col mx-auto items-center w-[90%] max-w-[20rem] py-6 h-[12rem] rounded-[20px] mt-4 bg-[#5356FF]">
        {showLoader && <Loader />}
        <label
          onClick={toggleInputVisibility}
          className="flex items-center cursor-pointer font-bold gap-2"
        >
          <FaLink size={20} /> Add Link
        </label>
        {showInput && (
          <input
            ref={inputRef}
            type="text"
            onChange={handleLinkChange}
            className="w-[90%] outline-none px-2 rounded-[5px] font-bold mt-4"
          />
        )}

        <button
          onClick={handleUpload}
          className="bg-black mt-4 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-[10px]"
        >
          Add
        </button>
        {link && !isValidGoogleSheetsLink(link) && (
          <p className="text-red-500 mt-2">Invalid Google Sheets link</p>
        )}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AddLink;
