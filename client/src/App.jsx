import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ItineraryDashboard from './components/ItineraryDashboard';
import ChatPanel from './components/ChatPanel';

function App() {
    const [itinerary, setItinerary] = useState(null);

    const handleItineraryUpdate = (data) => {
        console.log("Updating itinerary:", data);
        setItinerary(data);
    };

    return (
        <div className="flex min-h-screen bg-accent font-sans">
            <Sidebar />

            <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-4 lg:p-6 h-screen overflow-hidden flex flex-col lg:flex-row gap-6">

                {/* Itinerary Section - Takes more space */}
                <div className="flex-[2] h-full overflow-hidden">
                    <ItineraryDashboard itinerary={itinerary} />
                </div>

                {/* Chat Section */}
                <div className="flex-1 h-full min-w-[350px]">
                    <ChatPanel onItineraryUpdate={handleItineraryUpdate} />
                </div>

            </main>
        </div>
    );
}

export default App;
