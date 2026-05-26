// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import UploadBox from "../components/UploadBox";
// import ChatBox from "../components/ChatBox";

// export default function Dashboard() {
//   const [messages, setMessages] = useState([]);

//   return (
//     <div className="flex h-screen bg-[#f4f4f6]">
//       <Sidebar
//         messages={messages}
//         setMessages={setMessages}
//       />

//       <div className="flex-1 p-8 overflow-auto">
//         <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">
//           <h1 className="text-5xl font-bold mb-2">
//             AI Knowledge Assistant
//           </h1>

//           <p className="text-gray-500 text-xl">
//             Upload PDFs and ask questions instantly
//           </p>
//         </div>

//         <UploadBox />

//         <ChatBox
//           messages={messages}
//           setMessages={setMessages}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";
import { getUser } from "../services/auth";
import axios from "axios";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] =
    useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/chats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const chats = res.data.map(
        (chat) => ({
          id: chat._id,
          title: chat.question,
          messages: [
            {
              type: "question",
              text: chat.question,
            },
            {
              type: "answer",
              text: chat.answer,
            },
          ],
        })
      );

      setChatHistory(chats);

      if (chats.length > 0) {
        setCurrentChatId(chats[0].id);
        setMessages(
          chats[0].messages
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleNewChat = () => {
  //   setMessages([]);
  //   setCurrentChatId(null);
  // };
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChatHistory((prev) => [
      newChat,
      ...prev,
    ]);

    setCurrentChatId(newChat.id);
    setMessages([]);
  };
  return (
    <div className="flex h-screen bg-[#f4f4f6]">
      <Sidebar
        chatHistory={chatHistory}
        setMessages={setMessages}
        setCurrentChatId={
          setCurrentChatId
        }
        handleNewChat={
          handleNewChat
        }
      />

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">
          <h1 className="text-5xl font-bold mb-2">
            AI Knowledge Assistant
          </h1>

          <p className="text-gray-500 text-xl">
            Upload PDFs and ask questions instantly
          </p>
        </div>

        <UploadBox />

        <ChatBox
          messages={messages}
          setMessages={setMessages}
          currentChatId={currentChatId}
          setChatHistory={setChatHistory}
        />
      </div>
    </div>
  );
}