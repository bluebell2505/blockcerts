// src/pages/EventsList.jsx
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch - replace with actual API call
    const fetchEvents = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data that matches the certificate style from your image
        const mockEvents = [
          {
            id: 1,
            name: "Communication Skills Master Class",
            description:
              "Join TJ Walker in this comprehensive communication skills course that will transform your personal and professional interactions.",
            venue: "Online",
            date: "2024-06-15",
            capacity: 100,
            registered: 72,
          },
          {
            id: 2,
            name: "Public Speaking Workshop",
            description:
              "Learn to captivate your audience with proven public speaking techniques from industry experts.",
            venue: "Convention Center",
            date: "2024-07-20",
            capacity: 50,
            registered: 32,
          },
          {
            id: 3,
            name: "Leadership Communication",
            description:
              "Develop the communication skills needed to lead teams effectively and inspire action.",
            venue: "Business District Hall",
            date: "2024-08-10",
            capacity: 80,
            registered: 45,
          },
        ];
        
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our expert-led events to enhance your skills and advance your
            career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsList;