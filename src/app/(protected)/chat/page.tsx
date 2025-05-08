"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleReset = () => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
  };
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 p-8 pt-20 pb-12">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)] bg-gray-800 rounded-xl shadow-xl border border-gray-800 m-4">
        <div className="flex items-start p-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white bg-gray-900/90 rounded-lg hover:bg-indigo-600 transition-all duration-300 border border-gray-700 hover:border-indigo-500/50 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Reset Chat</span>
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-y-auto mb-6 space-y-6 relative pt-8 pr-12 pl-12 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-indigo-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-[#1F1F1F]">


        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            Ask me anything about finance and economics! 💰📊
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 shadow-lg transition-all hover:scale-[1.02] ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#1F1F1F] text-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1F1F1F] rounded-lg p-4 max-w-[80%] shadow-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        </motion.div>

        <div className="relative z-10 mt-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Ask about finance or economics..."
          className="flex-1 bg-[#1F1F1F] rounded-lg px-6 py-3 mb-6 mx-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 border border-gray-800 hover:border-gray-700 transition-colors placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 mb-6  mx-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;