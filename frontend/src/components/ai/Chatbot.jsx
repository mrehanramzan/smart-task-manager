import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageCircle, Sparkles, Loader, Minimize2, Maximize2 } from "lucide-react";

export default function Chatbot({ user, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hello! I'm your AI task assistant. I can help you analyze your productivity patterns, track time spent on tasks, and provide insights about your work habits. What would you like to know about your tasks?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions] = useState([
    "How much time did I spend on work tasks this week?",
    "What are my overdue tasks?",
    "Show me my productivity trends",
    "Which tasks take me the longest?"
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock user data
  const mockUser = user || {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    plan: "free"
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (messageText = inputMessage.trim()) => {
    if (!messageText) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(messageText);
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock AI responses based on user input
  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("time") && lowerInput.includes("week")) {
      return "Based on your task data, you've spent approximately 24 hours on tasks this week. Here's the breakdown:\n\n• Work tasks: 16 hours (67%)\n• Personal projects: 5 hours (21%)\n• Learning: 3 hours (12%)\n\nYour most productive day was Tuesday with 6 hours logged.";
    }

    if (lowerInput.includes("overdue")) {
      return "You currently have 2 overdue tasks:\n\n1. **Complete project proposal** - Due 2 days ago\n2. **Review team feedback** - Due 1 day ago\n\nI recommend prioritizing the project proposal since it's been overdue longer.";
    }

    if (lowerInput.includes("productivity") || lowerInput.includes("trends")) {
      return "Here are your productivity insights for the last 30 days:\n\n📈 **Trends:**\n• Task completion rate: 78% (↑ 5%)\n• Average time per task: 2.3 hours\n• Most productive time: 9 AM - 11 AM\n• Best day: Tuesdays\n\n🎯 **Recommendations:**\n• Schedule important tasks during peak hours\n• Break down tasks longer than 4 hours";
    }

    if (lowerInput.includes("longest") || lowerInput.includes("time consuming")) {
      return "Your most time-consuming task categories:\n\n1. **Design & Development** - 4.2 hours average\n2. **Research & Analysis** - 3.1 hours average\n3. **Meetings** - 1.8 hours average\n4. **Administrative** - 0.7 hours average\n\nConsider breaking down design tasks into smaller chunks!";
    }

    if (lowerInput.includes("help") || lowerInput.includes("what can you do")) {
      return "I can help you with various task-related insights! Here's what I can do:\n\n🔍 **Analytics & Insights:**\n• Analyze productivity patterns\n• Track time spent on tasks\n• Identify productive hours\n• Show completion rates\n\n📊 **Reports:**\n• Generate weekly/monthly summaries\n• Break down time by categories\n• Highlight overdue tasks\n\n💡 **Recommendations:**\n• Suggest optimal schedules\n• Help prioritize tasks\n• Identify bottlenecks";
    }

    return "I understand you're asking about your tasks. I can help you with insights about:\n\n• Time spent on tasks\n• Productivity patterns\n• Task completion rates\n• Overdue items\n• Weekly summaries\n\nWhat would be most helpful for you?";
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
      hour: '2-digit', 
      minute: '2-digit' 
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

      {/* Chatbot Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isMinimized ? 'w-80' : 'w-full lg:w-96'}`}>
        
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
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
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] flex ${
                        message.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          message.type === "user"
                            ? "bg-blue-600 ml-2"
                            : message.error
                            ? "bg-red-100 mr-2"
                            : "bg-gray-100 mr-2"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="h-3.5 w-3.5 text-white" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-gray-600" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : message.error
                            ? "bg-red-50 text-red-900 border border-red-200"
                            : "bg-gray-50 text-gray-900"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.type === "user"
                              ? "text-blue-200"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%]">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 mr-2 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Loader className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
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
                <div className="mt-1 text-xs text-gray-500">
                  Press Enter to send
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}