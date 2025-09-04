import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.COMPOSIO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const toolSlug = "GOOGLECALENDAR_EVENTS_LIST";

  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() - 30);
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 30);

  const requestBody = {
    entity_id: "ac_2jYKD5yyLtaC",
    connected_account_id: "ca_3RS_KWU-1lv_",
    arguments: {
      calendarId: "primary",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    },
  };

  try {
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
      return NextResponse.json(
        { error: "Failed to fetch from Composio", details: data.error },
        { status: response.status }
      );
    }

    const events = data.data.items || [];
    return NextResponse.json(events);
  } catch (error) {
    console.error("An unexpected error occurred in the API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
