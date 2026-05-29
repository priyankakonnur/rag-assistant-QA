import { useState } from "react";
import { askQuestion } from "../services/api";
import { getToken } from "../services/auth";

export default function ChatBox() {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      text: question,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentQuestion = question;
    setQuestion("");

    try {
      setLoading(true);

      const res = await askQuestion(
        currentQuestion,
        getToken()
      );

      const botMessage = {
        type: "bot",
        text:
          res.answer ||
          "No answer returned",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);
    } catch (error) {
      console.error(
        "Ask error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Failed to get response",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="h-96 overflow-y-auto mb-4 border rounded p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${
              msg.type === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <span className="inline-block bg-gray-100 px-4 py-2 rounded-xl">
              {msg.text}
            </span>
          </div>
        ))}

        {loading && (
          <p>Thinking...</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          placeholder="Ask a question..."
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendQuestion()
          }
          className="flex-1 border rounded-xl px-4 py-2"
        />

        <button
          onClick={sendQuestion}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}