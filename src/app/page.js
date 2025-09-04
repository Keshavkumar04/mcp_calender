"use client";

import { useState, useEffect } from "react";
import { MeetingList } from "../components/MeetingList";

export default function Home() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/getMeetings");

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const allEvents = (await response.json()) || [];

        const now = new Date();
        const upcoming = allEvents
          .filter((event) => new Date(event.start.dateTime) > now)
          .slice(0, 5);
        const past = allEvents
          .filter((event) => new Date(event.start.dateTime) <= now)
          .sort(
            (a, b) => new Date(b.start.dateTime) - new Date(a.start.dateTime)
          )
          .slice(0, 5);

        setUpcomingMeetings(upcoming);
        setPastMeetings(past);
      } catch (error) {
        // --- NEW: catch block ---
        console.error("Failed to fetch meetings:", error);
        setError(
          "Sorry, we couldn't load your meetings. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-teal-400">
          My Calendar Intelligence
        </h1>
        <p className="text-slate-400">
          Your meetings, organized and summarized.
        </p>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {isLoading ? (
          <p className="text-center w-full text-slate-400">
            Loading meetings...
          </p>
        ) : error ? (
          <p className="text-center w-full text-red-400 font-semibold">
            {error}
          </p>
        ) : (
          <>
            <MeetingList
              title="Upcoming Meetings"
              meetings={upcomingMeetings}
            />
            <MeetingList
              title="Past Meetings"
              meetings={pastMeetings}
              isPast={true}
            />
          </>
        )}
      </main>
    </div>
  );
}
