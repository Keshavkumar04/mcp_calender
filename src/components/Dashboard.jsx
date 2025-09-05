"use client";

import { useState, useEffect } from "react";
import { MeetingList } from "./MeetingList";
import AuthButton from "./AuthButton";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndMeetings = async () => {
      setIsLoading(true);
      setError(null);
      const profileRes = await fetch("/api/get-profile");
      const userProfile = await profileRes.json();
      setProfile(userProfile);
      if (userProfile?.composio_connected_account_id) {
        try {
          const meetingsRes = await fetch("/api/getMeetings");
          if (!meetingsRes.ok) throw new Error("Failed to fetch meetings");
          const allEvents = await meetingsRes.json();
          setMeetings(allEvents);
        } catch (err) {
          setError("Could not load your meetings.");
        }
      }
      setIsLoading(false);
    };
    fetchProfileAndMeetings();
  }, []);

  const handleConnectCalendar = async () => {
    try {
      const response = await fetch("/api/composio/initiate-connection", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get connection link.");
      }
      const { initiationUrl } = data;
      if (initiationUrl) {
        window.location.href = initiationUrl;
      }
    } catch (err) {
      console.error("Connection failed:", err);
      setError("Could not initiate calendar connection. Please try again.");
    }
  };

  const upcomingMeetings = meetings
    ? meetings
        .filter((e) => new Date(e.start.dateTime) > new Date())
        .slice(0, 5)
    : [];
  const pastMeetings = meetings
    ? meetings
        .filter((e) => new Date(e.start.dateTime) <= new Date())
        .sort((a, b) => new Date(b.start.dateTime) - new Date(a.start.dateTime))
        .slice(0, 5)
    : [];

  return (
    <div className="bg-slate-900 min-h-screen text-white p-8">
      <header className="relative flex items-center justify-center py-4 mb-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-teal-400">
            My Calendar Intelligence
          </h1>
          <p className="text-slate-400 mt-2">
            Your meetings, organized and summarized.
          </p>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2">
          <AuthButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {isLoading ? (
          <p className="text-center w-full text-slate-400">Loading...</p>
        ) : error ? (
          <p className="text-center w-full text-red-400 font-semibold">
            {error}
          </p>
        ) : profile && profile.composio_connected_account_id ? (
          <div className="flex flex-col md:flex-row gap-12">
            <MeetingList
              title="Upcoming Meetings"
              meetings={upcomingMeetings}
            />
            <MeetingList
              title="Past Meetings"
              meetings={pastMeetings}
              isPast={true}
            />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome!</h2>
            <p className="text-slate-400 mb-6">
              Connect your Google Calendar to get started.
            </p>
            <button
              onClick={handleConnectCalendar}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded"
            >
              Connect Your Calendar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
