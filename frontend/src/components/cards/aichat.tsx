"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import dynamic from 'next/dynamic';
import SendChat from "../lottie-ui/send-message"; // Import SendmessageIcon

// Dynamically import Lottie only on the client-side
const LottiePlayer = dynamic(() => import('lottie-react'), { ssr: false });

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
};

const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const fetchGeminiApiKey = async () => {
    try {
      const response = await axios.get('https://acanto7.onrender.com/api/details');
      return response.data.geminiApiKey;
    } catch (error) {
      console.error('Error fetching API key:', error);
      return null;
    }
  };

  const generateContent = async (prompt: string) => {
    try {
      const apiKey = await fetchGeminiApiKey();
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      }, {
        params: { key: apiKey },
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating content:', error);
      return 'Sorry, I encountered an error generating a response.';
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage: Message = { 
      text: inputMessage, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const botLoadingMessage: Message = { 
      text: 'Generating response...', 
      sender: 'bot', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, botLoadingMessage]);

    try {
      const generatedText = await generateContent(inputMessage);
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = { 
          text: generatedText, 
          sender: 'bot',
          timestamp: new Date()
        };
        return updatedMessages;
      });
    } catch (error) {
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = { 
          text: 'Sorry, I could not generate a response.', 
          sender: 'bot',
          timestamp: new Date()
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {/* Lottie Chat Icon */}
      <div
        className="fixed bottom-4 right-4 z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LottiePlayer 
          animationData={require('../../lottie/aichat/blep.json')} 
          loop 
          className="w-24 h-24" 
        />
      </div>

      {/* Chat Container */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 w-80 h-[500px] bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 
                     shadow-lg rounded-xl flex flex-col overflow-hidden 
                     max-w-full max-h-[80vh] sm:w-96 z-50"
        >
          {/* Chat Header */}
          <div 
            className="flex flex-row justify-between items-center 
                       border-b border-gray-200 dark:border-gray-700 p-4"
          >
            <h3 className="text-lg font-semibold dark:text-white">AI Chatbot</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                         transition-colors duration-200 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Content */}
          <div 
            ref={chatContentRef}
            className="flex-grow overflow-y-auto p-4 space-y-3 
                       bg-gray-50 dark:bg-gray-900"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  msg.sender === 'user' ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div 
            className="flex p-3 border-t border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-grow p-2 border border-gray-300 dark:border-gray-600 
                         rounded-full bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || inputMessage.trim() === ''}
              className=" bg-green-400 text-white rounded-full 
                         hover:bg-blue-600 disabled:bg-red-400 
                         transition-colors duration-200 
                         flex items-center justify-center"
            >
              <SendChat
              lottieName="SendChat" // Lottie animation for the icon
            />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;