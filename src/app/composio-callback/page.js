"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ComposioCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(
    "Connecting your account, please wait..."
  );

  useEffect(() => {
    const connectedAccountId = searchParams.get("connectedAccountId");
    const connectionStatus = searchParams.get("status");

    if (connectionStatus === "success" && connectedAccountId) {
      const saveConnection = async () => {
        try {
          const response = await fetch("/api/composio/save-connection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connectedAccountId }),
          });

          if (!response.ok) throw new Error("Failed to save connection.");

          router.push("/");
        } catch (error) {
          console.error(error);
          setStatus("An error occurred. Please try connecting again.");
        }
      };

      saveConnection();
    } else {
      setStatus("Connection failed or was cancelled. Redirecting...");
      setTimeout(() => router.push("/"), 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl animate-pulse">{status}</p>
      </div>
    </div>
  );
}
