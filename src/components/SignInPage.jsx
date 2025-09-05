import AuthButton from "@/components/AuthButton";

export default function SignInPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-teal-400">
          My Calendar Intelligence
        </h1>
        <p className="text-slate-400 mt-2 mb-10">
          Your meetings, organized and summarized.
        </p>
      </div>
      <AuthButton />
    </div>
  );
}
