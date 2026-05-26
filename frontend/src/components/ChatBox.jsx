// import { useEffect, useRef, useState } from "react";
// import api from "../services/api";
// import { getToken } from "../services/auth";

// export default function ChatBox({
//   messages,
//   setMessages,
// }) {
//   const [question, setQuestion] = useState("");
//   const [loading, setLoading] = useState(false);

//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages, loading]);

//   const askQuestion = async () => {
//     if (!question.trim()) return;

//     const currentQuestion = question;

//     setMessages((prev) => [
//       ...prev,
//       {
//         type: "user",
//         text: currentQuestion,
//       },
//     ]);

//     setQuestion("");
//     setLoading(true);

//     try {
//       const res = await api.get("/ask", {
//         params: {
//           query: currentQuestion,
//         },
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       setMessages((prev) => [
//         ...prev,
//         {
//           type: "ai",
//           text: res.data.answer,
//         },
//       ]);
//     } catch (error) {
//       console.error(error);

//       setMessages((prev) => [
//         ...prev,
//         {
//           type: "ai",
//           text:
//             "Something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       askQuestion();
//     }
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-sm mt-6 h-[70vh] flex flex-col overflow-hidden">
//       <div className="px-6 py-5 border-b">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Chat with your PDF
//         </h2>

//         <p className="text-sm text-gray-500 mt-1">
//           Ask anything about your uploaded document
//         </p>
//       </div>

//       <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-[#fafafa]">
//         {messages.length === 0 && (
//           <div className="h-full flex items-center justify-center text-gray-400 text-lg">
//             Ask anything about your uploaded document
//           </div>
//         )}

//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.type === "user"
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
//                 msg.type === "user"
//                   ? "bg-orange-500 text-white"
//                   : "bg-white text-gray-800 border"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="flex justify-start">
//             <div className="bg-white border px-5 py-3 rounded-2xl text-gray-500 shadow-sm">
//               AI is thinking...
//             </div>
//           </div>
//         )}

//         <div ref={bottomRef}></div>
//       </div>

//       <div className="border-t bg-white p-4 flex gap-3">
//         <input
//           type="text"
//           value={question}
//           placeholder="Ask a question about your PDF..."
//           onChange={(e) =>
//             setQuestion(e.target.value)
//           }
//           onKeyDown={handleKeyDown}
//           className="flex-1 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-orange-400"
//         />

//         <button
//           onClick={askQuestion}
//           disabled={loading}
//           className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-medium"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { getToken, getUser } from "../services/auth";

export default function ChatBox({
  messages,
  setMessages,
  currentChatId,
  setChatHistory,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const saveToLocalStorage = (updatedChats) => {
    const user = getUser();

    if (!user?.email) return;

    localStorage.setItem(
      `chatHistory_${user.email}`,
      JSON.stringify(updatedChats)
    );
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    if (!currentChatId) return;

    const currentQuestion = question;

    const userMessage = {
      type: "user",
      text: currentQuestion,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    // Save user question immediately
    setChatHistory((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              title:
                chat.title === "New Chat"
                  ? currentQuestion.slice(0, 30)
                  : chat.title,
              messages: updatedMessages,
            }
          : chat
      );

      saveToLocalStorage(updatedChats);

      return updatedChats;
    });

    try {
      const res = await api.get("/ask", {
        params: {
          query: currentQuestion,
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const aiMessage = {
        type: "ai",
        text: res.data.answer,
      };

      const finalMessages = [
        ...updatedMessages,
        aiMessage,
      ];

      setMessages(finalMessages);

      // Save AI response immediately
      setChatHistory((prevChats) => {
        const updatedChats = prevChats.map(
          (chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: finalMessages,
                }
              : chat
        );

        saveToLocalStorage(updatedChats);

        return updatedChats;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      askQuestion();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm mt-6 h-[70vh] flex flex-col overflow-hidden">
      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Chat with your PDF
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Ask anything about your uploaded document
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-[#fafafa]">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-lg">
            Ask anything about your uploaded document
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.type === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border px-5 py-3 rounded-2xl text-gray-500 shadow-sm">
              AI is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="border-t bg-white p-4 flex gap-3">
        <input
          type="text"
          value={question}
          placeholder="Ask a question about your PDF..."
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}