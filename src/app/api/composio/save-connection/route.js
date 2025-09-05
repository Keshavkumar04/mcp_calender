import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { connectedAccountId } = await request.json();
    if (!connectedAccountId) {
      return new Response(
        JSON.stringify({ error: "Connected Account ID is required." }),
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({ composio_connected_account_id: connectedAccountId })
      .eq("email", session.user.email);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error saving connection:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
