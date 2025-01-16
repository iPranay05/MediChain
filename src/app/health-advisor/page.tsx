'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { SignedIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function HealthAdvisorPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock AI response
      const aiResponse = "Based on your medical history and the information provided, here's my advice... [AI response would go here]";
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignedIn>
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              MediChain Health Advisor
            </h1>
            <p className="text-blue-100">
              Ask me anything about health, medications, or lifestyle advice. I'll provide general guidance based on your medical history.
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start by asking a health-related question!</p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm sm:text-base">{msg.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about health advice..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    (isLoading || !message.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-sm text-gray-500 text-center">
            <p>
              Note: This AI provides general guidance only and should not replace professional medical advice.
              Always consult with a healthcare provider for medical decisions.
            </p>
          </div>
        </div>
      </Layout>
    </SignedIn>
  );
}
