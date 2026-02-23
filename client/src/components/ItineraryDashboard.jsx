import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Clock, Sun, Moon, Coffee } from 'lucide-react';

const ItineraryDashboard = ({ itinerary }) => {
    if (!itinerary) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <MapPin size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">No Itinerary Generated Yet</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">Start chatting with the AI to plan your next adventure!</p>
            </div>
        );
    }

    // Handle both potential structures: nested 'itinerary' key or direct days
    const days = itinerary.itinerary || itinerary;

    // Convert object to array for mapping, filtering for keys starting with 'day'
    const dayKeys = Object.keys(days).filter(k => k.toLowerCase().startsWith('day'));

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden p-6 gap-6 overflow-y-auto scrollbar-hide">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full font-medium tracking-wider uppercase">Destination</span>
                    </div>
                    <h1 className="text-3xl font-bold text-primary">{itinerary.destination || "Unknown Destination"}</h1>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">May 15 - May 20</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">Budget: Moderate</span>
                    </div>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid gap-6">
                {dayKeys.map((dayKey, index) => {
                    const day = days[dayKey];
                    return (
                        <motion.div
                            key={dayKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300 bg-gray-50/50"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                                    Day {index + 1}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800">{day.title || `Day ${index + 1}`}</h3>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Morning */}
                                {day.morning && (
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2 text-orange-500">
                                            <Sun size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Morning</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 text-sm mb-1">{day.morning.activity || "Activity"}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{day.morning.description || ""}</p>
                                        {day.morning.cost && <p className="text-xs text-secondary font-semibold mt-2">{day.morning.cost}</p>}
                                    </div>
                                )}

                                {/* Afternoon */}
                                {day.afternoon && (
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2 text-blue-500">
                                            <Coffee size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Afternoon</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 text-sm mb-1">{day.afternoon.activity || "Activity"}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{day.afternoon.description || ""}</p>
                                        {day.afternoon.cost && <p className="text-xs text-secondary font-semibold mt-2">{day.afternoon.cost}</p>}
                                    </div>
                                )}

                                {/* Evening */}
                                {day.evening && (
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-500">
                                            <Moon size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Evening</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 text-sm mb-1">{day.evening.activity || "Activity"}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{day.evening.description || ""}</p>
                                        {day.evening.cost && <p className="text-xs text-secondary font-semibold mt-2">{day.evening.cost}</p>}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ItineraryDashboard;
