import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("composio_connected_account_id")
      .eq("email", session.user.email)
      .single();

    if (error && error.code !== "PGRST116") {
      // Ignore 'No rows found' error
      throw error;
    }

    return new Response(JSON.stringify(profile || null), { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
