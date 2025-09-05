import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Composio } from "@composio/core";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
  });

  const authConfigId = "ac_2jYKD5yyLtaC";
  const callbackUrl = "http://localhost:3000/composio-callback";
  const userId = session.user.email;

  try {
    console.log("Attempting to initiate connection via Composio SDK...");

    const connRequest = await composio.connectedAccounts.initiate(
      userId,
      authConfigId,
      { callbackUrl: callbackUrl }
    );

    console.log("SDK response received:", connRequest);

    return new Response(
      JSON.stringify({ initiationUrl: connRequest.redirectUrl }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initiating connection via SDK:", error);
    return new Response(
      JSON.stringify({ error: "Could not start connection process." }),
      { status: 500 }
    );
  }
}
