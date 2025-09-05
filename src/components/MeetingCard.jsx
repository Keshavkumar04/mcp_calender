import { useState } from "react";

// Array of mock summaries
const mockSummaries = [
  "This was a productive sync focused on Q4 planning. Key decisions included prioritizing the 'Phoenix' project and allocating additional resources to the design team. Action items were assigned to Alice for budget review and Bob for technical specs.",
  "A technical deep-dive on the new authentication API. The team resolved a critical bug related to token expiration and agreed on the final schema. Next steps involve updating the documentation.",
  "The session was a review of user feedback from the last beta release. Top feature requests were identified, and the product team will now create user stories for the upcoming sprint. The overall sentiment was positive.",
  "This was a 1-on-1 performance review discussing career growth and objectives for the next half. Key strengths were highlighted, and a plan for developing leadership skills was established.",
  "A creative brainstorming session for the new marketing campaign. The team focused on social media outreach and finalized the content calendar for October. The tagline 'Connect, Create, Captivate' was approved.",
];

const formatMeetingTime = (startStr, endStr) => {
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const duration = Math.round(
    (endDate.getTime() - startDate.getTime()) / 60000
  );
  return `${startDate.toLocaleDateString("en-US", options)} (${duration} min)`;
};

export const MeetingCard = ({ meeting, isPast }) => {
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const randomIndex = Math.floor(Math.random() * mockSummaries.length);
    const randomSummary = mockSummaries[randomIndex];

    setSummary(randomSummary);
    setIsSummarizing(false);
  };

  const handleCloseSummary = () => {
    setSummary(null);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700 transition-all">
      <h3 className="text-xl font-bold text-teal-400">{meeting.summary}</h3>
      <p className="text-slate-400 text-sm mb-2">
        {formatMeetingTime(meeting.start.dateTime, meeting.end.dateTime)}
      </p>
      <div className="text-slate-300">
        <h4 className="font-semibold">Attendees:</h4>
        <ul className="list-disc list-inside text-sm">
          {meeting.attendees ? (
            meeting.attendees.map((att) => <li key={att.email}>{att.email}</li>)
          ) : (
            <li>Just you</li>
          )}
        </ul>
      </div>
      {meeting.description && (
        <p className="text-slate-400 mt-3 text-xs whitespace-pre-wrap">
          {meeting.description}
        </p>
      )}

      {isPast && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          {summary ? (
            <div>
              <h4 className="font-semibold text-teal-400 mb-2">AI Summary:</h4>
              <p className="text-sm text-slate-300 italic">{summary}</p>
              <button
                onClick={handleCloseSummary}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-1 px-3 rounded text-xs mt-3"
              >
                Close Summary
              </button>
            </div>
          ) : isSummarizing ? (
            <p className="text-sm text-slate-400 animate-pulse">
              Generating summary...
            </p>
          ) : (
            <button
              onClick={handleSummarize}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Summarize Meeting
            </button>
          )}
        </div>
      )}
    </div>
  );
};
