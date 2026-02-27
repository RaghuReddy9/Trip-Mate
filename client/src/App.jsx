import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ItineraryDashboard from './components/ItineraryDashboard';
import ChatPanel from './components/ChatPanel';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent({ token, setToken }) {
    const [itinerary, setItinerary] = useState(null);

    const handleItineraryUpdate = (data) => {
        setItinerary(data);
    };

    return (
        <div className="flex min-h-screen bg-accent font-sans">
            <Sidebar token={token} setToken={setToken} />

            <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-4 lg:p-6 h-screen overflow-hidden flex flex-col lg:flex-row gap-6">
                {/* Itinerary Section - Takes more space */}
                <div className="flex-[2] h-full overflow-hidden">
                    <ItineraryDashboard itinerary={itinerary} token={token} />
                </div>

                {/* Chat Section */}
                <div className="flex-1 h-full min-w-[350px]">
                    <ChatPanel onItineraryUpdate={handleItineraryUpdate} token={token} />
                </div>
            </main>
        </div>
    );
}

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
                <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
                <Route path="/" element={<AppContent token={token} setToken={setToken} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
