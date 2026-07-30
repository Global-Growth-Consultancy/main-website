import React, { useState } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // Simulated bot response
    setTimeout(() => {
      const botReply = { sender: "bot", text: "Thank you for reaching out!" };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={24} />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-white text-black shadow-lg rounded-lg w-80 p-4 mt-2">
          <div className="max-h-64 overflow-y-auto p-2 border-b">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg ${
                  msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white p-2 rounded-r"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
