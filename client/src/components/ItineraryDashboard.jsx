import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Clock, Sun, Moon, Coffee, Download, Save, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ItineraryDashboard = ({ itinerary, token }) => {
    const printRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(data, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(data, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`${itinerary.destination || 'My_Itinerary'}.pdf`);
    };

    const handleSaveItinerary = async () => {
        if (!token) {
            alert("Please log in to save itineraries.");
            return;
        }

        setIsSaving(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/itinerary/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    destination: itinerary.destination || "Unknown",
                    start_date: "TBD", // To be implemented in future UI extensions
                    end_date: "TBD",
                    budget: itinerary.budget || "Unspecified",
                    travel_style: itinerary.travel_style || "Unspecified",
                    itinerary_json: itinerary
                })
            });

            if (response.ok) {
                setSaved(true);
            } else {
                alert("Failed to save itinerary.");
            }
        } catch (error) {
            console.error("Save error: ", error);
        } finally {
            setIsSaving(false);
        }
    };

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

            {/* Header Actions */}
            <div className="flex items-center justify-end gap-3 mb-2">
                <button
                    onClick={handleSaveItinerary}
                    disabled={isSaving || saved || !token}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition disabled:opacity-50 text-sm font-medium"
                >
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? 'Saved' : isSaving ? 'Saving...' : 'Save to Profile'}
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 shadow-md shadow-secondary/20 transition text-sm font-medium"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>

            <div ref={printRef} className="p-4 bg-white rounded-xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full font-medium tracking-wider uppercase">Destination</span>
                        </div>
                        <h1 className="text-3xl font-bold text-primary">{itinerary.destination || "Unknown Destination"}</h1>
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
        </div>
    );
};

export default ItineraryDashboard;
