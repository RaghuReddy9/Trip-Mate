import React from 'react';
import { Home, Compass, MessageSquare, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const menuItems = [
        { icon: <Home size={20} />, label: 'Dashboard', active: true },
        { icon: <Compass size={20} />, label: 'Discover', active: false },
        { icon: <MessageSquare size={20} />, label: 'Chats', active: false },
        { icon: <Settings size={20} />, label: 'Settings', active: false },
    ];

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex flex-col w-20 lg:w-64 bg-primary text-white h-screen fixed left-0 top-0 border-r border-[#1a1a1a] z-50 transition-all duration-300"
        >
            <div className="p-6 flex items-center justify-center lg:justify-start gap-4 border-b border-[#1a1a1a]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <img src="/logo.png" alt="Trip Mate Logo" className="w-14 h-14 object-contain" />
                </div>
                <span className="hidden lg:block font-bold pl-1 text-xl tracking-wide">Trip Mate</span>
            </div>

            <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${item.active ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}
                    >
                        <div className="flex-shrink-0">{item.icon}</div>
                        <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#1a1a1a] text-gray-400 hover:text-white transition-colors">
                    <User size={20} />
                    <span className="hidden lg:block text-sm font-medium">Profile</span>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
