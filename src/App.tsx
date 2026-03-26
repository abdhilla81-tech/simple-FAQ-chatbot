import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { getChatSession } from './services/geminiService';
import { FAQ_DATA } from './constants';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your FAQ assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatRef.current = getChatSession();
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = getChatSession();
      }

      const response = await chatRef.current.sendMessage({ message: input });
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-bottom border-gray-100 flex items-center gap-3 bg-white z-10">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">FAQ Assistant</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-gray-200' : 'bg-gray-900 text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gray-900 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="p-4 bg-gray-100 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {FAQ_DATA.slice(0, 3).map((faq, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(faq.question)}
                className="text-xs bg-white border border-gray-200 hover:border-gray-900 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-2"
              >
                <MessageSquare size={12} />
                {faq.question}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 font-medium uppercase tracking-widest">
        Simple FAQ Chatbot &bull; 2026
      </p>
    </div>
  );
}
