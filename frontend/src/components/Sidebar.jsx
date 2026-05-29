import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  chatHistory = [],
  setMessages,
  setCurrentChatId,
  handleNewChat,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
  };

  return (
    <div className="w-72 bg-white shadow-xl p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">
        RAG Assistant
      </h1>

      <button
        onClick={handleNewChat}
        className="bg-orange-500 text-white rounded-2xl p-4 mb-6 hover:bg-orange-600 transition w-full"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-400 uppercase text-sm mb-4">
          Chat History
        </p>

        <div className="space-y-3">
          {!chatHistory?.length ? (
            <p className="text-gray-400 text-sm">
              No chats yet
            </p>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => openChat(chat)}
                className="bg-gray-100 p-3 rounded-xl text-sm truncate cursor-pointer hover:bg-gray-200 transition"
              >
                {chat.title || "New Chat"}
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl mt-6 transition"
      >
        Logout
      </button>
    </div>
  );
}