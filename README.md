# Mcp Calendar (Model Context Protocol)

The app connects to users' Google Calendars via an MCP (Model Context Protocol) layer, fetches their past and upcoming meetings, and provides contextual intelligence in a clean, user-friendly interface.

## Tech Stack Used

- Framework: Next.js (React)
- Styling: Tailwind CSS
- Authentication: Auth.js (NextAuth.js) with Google OAuth Provider
- Database: Supabase (PostgreSQL)
- Calendar Integration (MCP): Composio SDK
- Hosting: Vercel

## Features Implemented

- [x] Full Google OAuth Login
- [x] Dynamic Calendar Integration for Logged-In Users
- [x] Detailed Meeting Display (Past & Upcoming)
- [x] Dynamic Mock AI Summary Generation
- [x] Robust Error & Loading State Handling
- [x] Live Vercel Deployment
- [x] Supabase Database Integration for User Profiles

## Assumptions & Design Decisions

- **Full-Stack with Next.js:** Utilized Next.js to create a secure, server-side API proxy for communicating with Composio, preventing CORS issues and protecting API keys.

- **Production-Ready Auth:** Implemented a full Google OAuth flow instead of a mock login to build a scalable and secure multi-user application from the outset.

- **Database for Scalability:** Integrated Supabase to persist user data, which was essential for mapping users to their unique calendar connection IDs in a multi-user environment.

- **Mock AI for Rapid Prototyping:** Developed the complete AI summary UI with a dynamic mock function, allowing for a polished user experience while keeping the backend ready for a live AI model integration.

## How to Run Locally

1. Clone the repository:

```
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:

```
npm install
```

3. Set up environment variables:

```
NEXTAUTH_URL=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
COMPOSIO_API_KEY=
```

4. Start the development server:

```
npm run dev
```
