import { MessageCircle } from "lucide-react";

export default function ChatbotTrigger({ onClick, hasUnreadMessages = false }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
      aria-label="Open AI Assistant"
    >
      <MessageCircle className="h-6 w-6" />
      
      {/* Notification dot for unread messages */}
      {hasUnreadMessages && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
    </button>
  );
}