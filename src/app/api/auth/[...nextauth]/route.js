import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ profile }) {
      if (!profile || !profile.email) {
        return false;
      }

      try {
        const { data: user, error: checkError } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", profile.email)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking user:", checkError);
          return false;
        }

        if (!user) {
          console.log(`No profile found for ${profile.email}, creating one.`);
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({ email: profile.email });

          if (insertError) {
            console.error("Error creating user profile:", insertError);
            return false;
          }
        }

        return true;
      } catch (err) {
        console.error("Database operation failed:", err);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
