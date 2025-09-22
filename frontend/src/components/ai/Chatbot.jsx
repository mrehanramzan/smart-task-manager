import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Sparkles, Loader, Minimize2, Maximize2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";  
import { query_tasks } from "../../apis/llm";

export default function Chatbot({ isOpen, onClose }) {
  const { user } = useAuth(); 
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI task assistant. I can help analyze productivity, track time spent, and provide insights. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions] = useState([
    "How much time did I spend on work tasks this week?",
    "What are my overdue tasks?",
    "Show me my productivity trends",
    "Which tasks take me the longest?",
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage.trim()) => {
    if (!messageText || !user) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // ✅ call real API with query and user.id
      const res = await query_tasks(messageText);
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: res ? res : "Sorry, I couldn't fetch your task insights.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          content: "Error: Something went wrong while fetching task insights.",
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${isMinimized ? "w-80" : "w-full lg:w-96"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-600">Task insights & help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4 text-gray-500" />
                ) : (
                  <Minimize2 className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] flex ${
                        m.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          m.type === "user"
                            ? "bg-blue-600 ml-2"
                            : m.error
                            ? "bg-red-100 mr-2"
                            : "bg-gray-100 mr-2"
                        }`}
                      >
                        {m.type === "user" ? (
                          <User className="h-3.5 w-3.5 text-white" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-gray-600" />
                        )}
                      </div>
                      {/* Message */}
                      <div
                        className={`rounded-lg p-3 ${
                          m.type === "user"
                            ? "bg-blue-600 text-white"
                            : m.error
                            ? "bg-red-50 text-red-900 border border-red-200"
                            : "bg-gray-50 text-gray-900"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {m.content}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            m.type === "user" ? "text-blue-200" : "text-gray-500"
                          }`}
                        >
                          {formatTimestamp(m.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Loading */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%]">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 mr-2 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-2">
                        <Loader className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                  <div className="space-y-1">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your tasks..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows="2"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">Press Enter to send</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}