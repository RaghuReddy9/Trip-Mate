import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const ChatPanel = ({ onItineraryUpdate, token }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Namasthe! I\'m your Trip Mate Assistant. Tell me where you want to go, your dates, budget, and travel style!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateItinerary = async (text) => {
        // Basic heuristic to detect potential itinerary requests
        // Ideally this logic should be more robust or explicit
        if (text.toLowerCase().includes('generate') || text.toLowerCase().includes('plan') || text.toLowerCase().includes('trip')) {
            try {
                // Mock parsing for demonstration - strictly this should be smarter or done by the LLM via tool calling
                // For this demo, let's ask the LLM to structure this via the specialized endpoint if users ask specifically.
                // Or we can try to extract entities. 
                // For simplicity in this prompt-based flow, we'll use a separate button or command for structured generation,
                // OR we can make the chat agent decide.
                // Let's keep it simple: The chat is free-form.
                // But the user guide says "User provides: Location, Start & End dates, Budget, Travel style... AI returns a day-by-day plan in JSON"

                // Let's just use the chat endpoint for conversation.
                // If we want the structured JSON, we might need a specific trigger.
                // For now, let's focus on the chat experience. 
                pass;
            } catch (error) {
                console.error("Error generating itinerary:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ message: input, history: messages }), // sending entire history might become large
            });

            if (!response.body) throw new Error('ReadableStream not supported');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = { role: 'assistant', content: '' };

            setMessages(prev => [...prev, assistantMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                assistantMessage.content += chunk;

                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...assistantMessage };
                    return newMessages;
                });
            }

            // Check if the response looks like JSON (itinerary)
            // This is a naive check. A better way is to have a structured output mode.
            try {
                const jsonMatch = assistantMessage.content.match(/```json\n([\s\S]*?)\n```/) || assistantMessage.content.match(/{[\s\S]*}/);
                if (jsonMatch) {
                    const jsonStr = jsonMatch[1] || jsonMatch[0];
                    const itineraryData = JSON.parse(jsonStr);
                    onItineraryUpdate(itineraryData);
                }
            } catch (e) {
                // Not JSON or failed to parse
            }

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-secondary" />
                    <h2 className="font-semibold text-sm">Trip Mate Assistant</h2>
                </div>
                <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs text-gray-300">Online</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, idx) => {
                    // Helper to strip out the raw JSON objects or markdown JSON blocks from the chat bubble
                    const cleanMessageContent = (text) => {
                        let cleaned = text.replace(/```json\n[\s\S]*?\n```/g, '');
                        // Also try to strip raw JSON objects that might accidentally leak
                        cleaned = cleaned.replace(/\{[\s\S]*"destination"[\s\S]*\}/g, '');
                        return cleaned.trim();
                    };

                    const displayContent = msg.role === 'assistant' ? cleanMessageContent(msg.content) : msg.content;

                    // Don't render empty bubbles if the only thing the AI returned was JSON
                    if (!displayContent && msg.role === 'assistant') return null;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-secondary text-white rounded-br-none shadow-md shadow-secondary/10'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <ReactMarkdown>{displayContent}</ReactMarkdown>
                            </div>
                        </motion.div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-secondary/50 focus-within:border-secondary transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your dreamp trip..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-3 text-sm text-gray-800 placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 mr-1 rounded-lg bg-secondary text-white disabled:opacity-50 hover:bg-opacity-90 transition-all font-medium flex items-center justify-center w-8 h-8"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
                <p className="text-[10px] text-center mt-2 text-gray-400">AI can make mistakes. Verify important info.</p>
            </form>
        </div>
    );
};

export default ChatPanel;
