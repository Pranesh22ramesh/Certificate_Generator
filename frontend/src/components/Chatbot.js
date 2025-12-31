import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Chatbot = () => {
    const { user, userType, isAuthenticated } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your AI Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Context-aware response logic
    const generateResponse = (query) => {
        const q = query.toLowerCase();

        if (!isAuthenticated) return "Please log in so I can assist you better!";

        if (userType === 'user') {
            const intern = user?.intern || user; // Handle data structure variations
            if (!intern) return "I can't access your profile data right now.";

            if (q.includes('status')) return `Your current internship status is: ${intern.status}.`;
            if (q.includes('certificate')) return intern.certificateAccessEnabled ? "Good news! Your certificate is available for download on your dashboard." : "Your certificate is not yet available. Please complete your internship or contact admin.";
            if (q.includes('duration') || q.includes('long') || q.includes('days')) {
                const start = new Date(intern.startDate).toLocaleDateString();
                const end = new Date(intern.endDate).toLocaleDateString();
                return `Your internship runs from ${start} to ${end}.`;
            }
            if (q.includes('supervisor')) return intern.supervisor ? `Your supervisor is ${intern.supervisor}.` : "No supervisor is assigned to your record.";
            if (q.includes('department') || q.includes('domain')) return `You are assigned to the ${intern.department} department.`;
            if (q.includes('feedback')) return "You can submit your feedback using the 'Give Feedback' button in the dashboard.";
            if (q.includes('contact') || q.includes('admin')) return "You can contact the administration via the Contact page.";

            return "I can help you with your internship details, certificate status, duration, and feedback. What would you like to know?";
        }

        if (userType === 'admin') {
            if (q.includes('intern') || q.includes('count')) return "You can manage all interns from the Dashboard or Intern Management page.";
            if (q.includes('add') || q.includes('create')) return "To add a new intern, navigate to 'Add Intern' in the sidebar.";
            if (q.includes('feedback')) return "You can view and manage all intern feedbacks in the Feedback section.";
            if (q.includes('certificate')) return "You can generate and preview certificates for eligible interns from the Intern Management list.";

            return "I can assist you with administrative tasks like managing interns, checking feedbacks, and system navigation.";
        }

        return "How can I help you regarding the Certificate Generator system?";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User Message
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI Delay
        setTimeout(() => {
            const responseText = generateResponse(input);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    if (!isAuthenticated) return null; // Only show when logged in

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ maxHeight: '500px', height: '60vh' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Twincord AI</h3>
                                    <p className="text-sky-100 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-sky-600 text-white rounded-tr-sm'
                                            : 'bg-slate-700 text-slate-200 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask something..."
                                className="flex-1 bg-slate-900 border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors flex items-center justify-center shrink-0 w-10 h-10"
                            >
                                <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-sky-500 to-indigo-600 w-14 h-14 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center text-white relative group"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 group-hover:opacity-40"></div>
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
