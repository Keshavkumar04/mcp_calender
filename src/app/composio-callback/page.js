import { Suspense } from "react";
import CallbackHandler from "@/components/CallbackHandler";

function Loading() {
  return <p className="text-xl animate-pulse">Loading callback...</p>;
}

export default function ComposioCallbackPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center">
      <Suspense fallback={<Loading />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
