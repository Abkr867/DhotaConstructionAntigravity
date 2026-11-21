import { MessageCircle } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = "+919110986889";
  const message = encodeURIComponent("Hello! I'm interested in your construction services. Please provide more information.");
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;

  return (
    <>
      {/* Popup Message */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 bg-white rounded-lg shadow-2xl p-4 w-72 border border-gray-200 animate-fade-in-up"
          data-testid="whatsapp-popup"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Dhota Construction</p>
              <p className="text-sm text-gray-600 mt-1">
                Hi there! 👋 How can we help you with your construction project?
              </p>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
            data-testid="whatsapp-chat-link"
          >
            Start Chat
          </a>
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg whatsapp-pulse transition-colors"
        data-testid="whatsapp-button"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </>
  );
};

export default WhatsAppButton;
