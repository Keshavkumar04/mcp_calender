"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const GoogleLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.766 12.2727C23.766 11.4909 23.6977 10.7273 23.5625 10H12.2418V14.4545H18.7303C18.4489 15.8182 17.5955 16.9818 16.342 17.8182V20.4545H20.1871C22.4438 18.4545 23.766 15.6364 23.766 12.2727Z"
      fill="#4285F4"
    />
    <path
      d="M12.2418 24C15.429 24 18.096 22.9273 20.1871 20.4545L16.342 17.8182C15.2484 18.5455 13.8642 19 12.2418 19C9.04545 19 6.32784 17.0727 5.25409 14.2364H1.28352V16.9636C3.33693 21.0545 7.45341 24 12.2418 24Z"
      fill="#34A853"
    />
    <path
      d="M5.25409 14.2364C5.01648 13.5273 4.88125 12.7818 4.88125 12C4.88125 11.2182 5.01648 10.4727 5.25409 9.76364V7.03636H1.28352C0.468182 8.70909 0 10.3 0 12C0 13.7 0.468182 15.2909 1.28352 16.9636L5.25409 14.2364Z"
      fill="#FBBC05"
    />
    <path
      d="M12.2418 5C13.9781 5 15.5236 5.61818 16.7906 6.81818L20.2727 3.54545C18.0858 1.54545 15.4187 0 12.2418 0C7.45341 0 3.33693 2.94545 1.28352 7.03636L5.25409 9.76364C6.32784 6.92727 9.04545 5 12.2418 5Z"
      fill="#EA4335"
    />
  </svg>
);

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-end gap-2 text-sm">
        <p className="text-slate-400">{session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 bg-slate-800 hover:bg-red-700/20 border border-slate-700 hover:border-red-600 text-slate-300 hover:text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-4 bg-white text-slate-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <GoogleLogo />
      <span>Sign in with Google</span>
    </button>
  );
}
