import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

// Environment variable approach is safer
const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_API;

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initial greeting when component mounts
  useEffect(() => {
    const greeting: Message = {
      role: "assistant",
      text: "Hello! I'm your mental health companion. How are you feeling today?",
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Construct the message with the mental health context
      const promptText = `You are a compassionate mental health support chatbot named MindfulCompanion. 
Guidelines:
- Respond with empathy and warmth to the user's emotional state
- Use a supportive, non-judgmental tone
- Offer gentle suggestions for well-being when appropriate
- For severe concerns, recommend professional help
- Keep responses concise (2-3 paragraphs maximum)
- Focus on validation and practical support strategies
- Never diagnose medical conditions
- Prioritize safety if the user expresses harmful thoughts
- End responses with a gentle question to continue the conversation

User message: ${input}`;

      // The correct format for Gemini API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [
                { text: promptText }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm having trouble responding right now. How else might I help you?";
      
      const botMessage: Message = { 
        role: "assistant", 
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      
      const errorMessage: Message = { 
        role: "assistant", 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
    
    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" 
        ? "bg-gradient-to-br from-blue-50 to-white" 
        : "bg-gradient-to-br from-gray-900 to-gray-800"
    }`}>
      {/* Header with theme toggle */}
      <div className="w-full border-b shadow-sm p-4 flex justify-between items-center mb-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-600 text-white text-2xl">
            🧠
          </div>
          <h1 className={`ml-3 text-2xl font-semibold ${
            theme === "light" ? "text-blue-700" : "text-blue-400"
          }`}>
            MindfulCompanion
          </h1>
        </div>
      </div>

      <div className="container mx-auto flex flex-col items-center p-4 pt-2">
        <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-7rem)]">
          {/* Main chat container */}
          <div className={`flex-1 p-4 rounded-t-xl shadow-md overflow-y-auto ${
            theme === "light" ? "bg-white border border-blue-100" : "bg-gray-800 border border-gray-700"
          }`}>
            <div className="flex flex-col space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      🧠
                    </div>
                  )}
                  <div
                    className={`max-w-md p-4 rounded-xl text-sm shadow-sm ${
                      msg.role === "user"
                        ? theme === "light" 
                          ? "bg-blue-600 text-white" 
                          : "bg-blue-800 text-white"
                        : theme === "light"
                          ? "bg-gray-100 text-gray-800" 
                          : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">
                        {msg.role === "user" ? "You" : "MindfulCompanion"}
                      </span>
                      <span className={`text-xs ${msg.role === "user" ? "opacity-75" : "text-gray-500 dark:text-gray-400"}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center ml-2 bg-blue-600 text-white dark:bg-blue-700">
                      👤
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    🧠
                  </div>
                  <div className={`p-4 rounded-xl ${
                    theme === "light" ? "bg-gray-100" : "bg-gray-700"
                  }`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: "0s"}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className={`p-4 rounded-b-xl shadow-md ${
            theme === "light" ? "bg-gray-50 border-t border-gray-200" : "bg-gray-800 border-t border-gray-700"
          }`}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  placeholder="Share how you're feeling..."
                  className={`w-full p-4 pr-12 rounded-xl border resize-none min-h-[60px] max-h-32 focus:outline-none focus:ring-2 ${
                    theme === "light"
                      ? "bg-white border-blue-300 focus:ring-blue-400 text-gray-800"
                      : "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
                  }`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  style={{
                    height: "60px",
                    maxHeight: "120px",
                  }}
                  disabled={loading}
                />
                <div className="absolute right-3 bottom-3 text-gray-500 dark:text-gray-400 text-xs">
                  Press Enter to send
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`h-[60px] px-6 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  loading || !input.trim() 
                    ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <p className={`text-xs text-center mt-3 ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}>
            This is a supportive AI chatbot. For serious mental health concerns, please contact a licensed professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;