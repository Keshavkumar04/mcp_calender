import { MeetingCard } from "./MeetingCard";

export const MeetingList = ({ title, meetings, isPast }) => {
  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-slate-600 pb-2">
        {title}
      </h2>
      {meetings.length > 0 ? (
        meetings.map((meeting, index) => (
          <MeetingCard key={index} meeting={meeting} isPast={isPast} />
        ))
      ) : (
        <p className="text-slate-500">No meetings found.</p>
      )}
    </div>
  );
};
