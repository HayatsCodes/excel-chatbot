/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import UploadFile from "./UploadFile";
import AddLink from "./AddLink";
import { IoIosSend } from "react-icons/io";

function App() {
  const welcomeMessage = `
🤖 Welcome to the Excel Spreadsheet AI Chat Bot! 📊

I'm here to assist you with analyzing your spreadsheet data. You can upload your Excel (.xlsx) or CSV files, and I'll provide insights and answer any data-related questions you have.

If you also have a Google Sheet you'd like to analyze, just provide the link, and I'll handle the rest.

Let's dive into your data together! 💬
`;
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: welcomeMessage,
    },
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const inputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [addedLink, setAddedLink] = useState(null);
  const handleUploadedFileName = (fileName) => {
    setUploadedFileName(fileName);
  };

  const handleAddedLink = (link) => {
    setAddedLink(link);
  };

  function updateChat() {
    console.log("Uploaded file name in the updateChat:", uploadedFileName);
    const input = inputRef.current.value.trim();
    if (input) {
      const product = getReply(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "user", text: input },
        { from: "bot", text: product },
      ]);
      inputRef.current.value = "";
      scrollChat();
    } else if (uploadedFileName) {
      const product = `📂 Uploaded file: ${uploadedFileName}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "user", text: product },
      ]);
      scrollChat();
      setBotTyping(true);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", text: "📊 What Insights do you need from your data?" },
        ]);
        setBotTyping(false);
        scrollChat();
      }, 2000);
    } else if (addedLink) {
      const product = `🔗 Added link: ${addedLink}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "user", text: product },
      ]);
      scrollChat();
      setBotTyping(true);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", text: "📊 What Insights do you need from your data?" },
        ]);
        setBotTyping(false);
        scrollChat();
      }, 2000);
    }
  }

  function getReply(input) {
    return "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, repellendus, ex neque assumenda libero quaerat atque asperiores, iste magnam reprehenderit unde. Magnam delectus fugit ab labore aliquam libero voluptatibus modi!";
  }

  function scrollChat() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop =
      messagesContainer.scrollHeight - messagesContainer.clientHeight;
    setTimeout(() => {
      messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
    }, 100);
  }

  return (
    <div className="bg-[#bedbe9]">
      <h1 className="text-center font-bold mb-4 pt-4 text-lg">
        Excel AI Chat Bot
      </h1>
      <div className="flex-1 p-2 w-[90%] shadow-xl mx-auto sm:p-6 justify-between border rounded-[20px] flex flex-col h-[90vh]  bg-[#DFF5FF]">
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch custom-scrollbar"
        >
          {messages.map((message, key) => (
            <div key={key}>
              <div
                className={`flex items-end ${
                  message.from === "bot" ? "" : "justify-end"
                }`}
              >
                <div
                  className={`flex flex-col space-y-2 text-md  max-w-lg mx-2 ${
                    message.from === "bot"
                      ? "order-2 items-start"
                      : "order-1 items-end"
                  }`}
                >
                  <div>
                    <span
                      className={`px-4 py-3 rounded-xl inline-block leading-8 ${
                        message.from === "bot"
                          ? "rounded-bl-none bg-gray-100 text-gray-600"
                          : "rounded-br-none bg-[#67C6E3] text-black"
                      }`}
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    ></span>
                  </div>
                </div>
                <img
                  src={
                    message.from === "bot"
                      ? "https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                      : "https://i.pravatar.cc/100?img=60"
                  }
                  alt=""
                  className={`w-6 h-6 rounded-full ${
                    message.from === "bot" ? "order-1" : "order-2"
                  }`}
                />
              </div>
              {messages.length === 1 && (
                <div className="flex justify-between sm:justify-center sm:gap-[20px] xs:flex-col">
                  <UploadFile
                    handleUploadedFileName={handleUploadedFileName}
                    updateChat={updateChat}
                  />
                  <AddLink
                    handleAddedLink={handleAddedLink}
                    updateChat={updateChat}
                    handleUploadedFileName={handleUploadedFileName}
                  />
                </div>
              )}
            </div>
          ))}
          {botTyping && (
            <div>
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                  <div>
                    <img
                      src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                      alt="..."
                      className="w-16 ml-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              placeholder={
                messages.length < 2
                  ? "Upload a file or add a link to chat"
                  : "Let's analyze your data..."
              }
              autoComplete="off"
              autoFocus={true}
              onKeyDown={(e) => e.key === "Enter" && updateChat()}
              className="text-md w-full focus:outline-none  text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-[#67C6E3] rounded-full py-2"
              ref={inputRef}
              readOnly={messages.length < 2}
            />
            <div className="absolute right-2 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-[#67C6E3] hover:bg-bg-[#67C6E3] focus:outline-none"
                onClick={updateChat}
              >
                <IoIosSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
