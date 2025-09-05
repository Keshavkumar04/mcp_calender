// ### This is for the single user (My account) for testing ###

// import { NextResponse } from "next/server";

// export async function GET() {
//   const apiKey = process.env.COMPOSIO_API_KEY;

//   if (!apiKey) {
//     return NextResponse.json({ error: "API key is missing" }, { status: 500 });
//   }

//   const toolSlug = "GOOGLECALENDAR_EVENTS_LIST";

//   const timeMin = new Date();
//   timeMin.setDate(timeMin.getDate() - 30);
//   const timeMax = new Date();
//   timeMax.setDate(timeMax.getDate() + 30);

//   const requestBody = {
//     entity_id: "keshavkumar2003.1march@gmail.com",
//     connected_account_id: "ca_lMXSVxCoTxN1",
//     arguments: {
//       calendarId: "primary",
//       timeMin: timeMin.toISOString(),
//       timeMax: timeMax.toISOString(),
//       singleEvents: true,
//       orderBy: "startTime",
//       maxResults: 250,
//     },
//   };

//   try {
//     const response = await fetch(
//       `https://backend.composio.dev/api/v3/tools/execute/${toolSlug}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": apiKey,
//         },
//         body: JSON.stringify(requestBody),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok || !data.successful) {
//       console.error("Composio API returned an error:", data);
//       return NextResponse.json(
//         { error: "Failed to fetch from Composio", details: data.error },
//         { status: response.status }
//       );
//     }

//     const events = data.data.items || [];
//     return NextResponse.json(events);
//   } catch (error) {
//     console.error("An unexpected error occurred in the API route:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

///////////////////////////////////////////////////////////

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("composio_connected_account_id, email")
      .eq("email", session.user.email)
      .single();

    if (profileError || !profile || !profile.composio_connected_account_id) {
      console.error(
        "Profile or connection ID not found for user:",
        session.user.email,
        profileError
      );
      return new Response(
        JSON.stringify({ error: "Calendar not connected for this user." }),
        { status: 400 }
      );
    }

    const connectedAccountId = profile.composio_connected_account_id;
    const entityId = profile.email;

    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
      });
    }

    const toolSlug = "GOOGLECALENDAR_EVENTS_LIST";

    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 30);
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 30);

    const requestBody = {
      entity_id: entityId,
      connected_account_id: connectedAccountId,
      arguments: {
        calendarId: "primary",
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
      },
    };

    const response = await fetch(
      `https://backend.composio.dev/api/v3/tools/execute/${toolSlug}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.successful) {
      console.error("Composio API returned an error:", data);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch from Composio",
          details: data.error,
        }),
        { status: response.status }
      );
    }

    const events = data.data.items || [];
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error("An unexpected error occurred in the API route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
