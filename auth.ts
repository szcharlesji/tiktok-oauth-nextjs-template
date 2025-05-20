import NextAuth from "next-auth";
import TikTok from "next-auth/providers/tiktok";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TikTok({
      clientId: process.env.AUTH_TIKTOK_ID,
      clientSecret: process.env.AUTH_TIKTOK_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? Date.now() + account.expires_at * 1000
          : undefined;
        token.id = user.id;

        // If you need to include raw TikTok profile data in the token:
        const tiktokProfile = profile as any; // Cast carefully or define a type for TikTok profile v5
        if (tiktokProfile) {
          // Check based on actual profile structure from v5 TikTok provider
          // Adjust this based on how TikTok provider in v5 returns profile data.
          // It might be directly on `profile` or nested differently.
          // For instance, if it's directly on `profile`:
          token.tiktokUser = {
            open_id: tiktokProfile.id, // Assuming profile.id is open_id
            display_name: tiktokProfile.name,
            avatar_url: tiktokProfile.image,
            // map other fields if available and needed
          };
        } else if (
          account?.providerAccountId &&
          account.provider === "tiktok"
        ) {
          // Fallback or alternative way to get basic identifiers if profile structure is minimal
          token.tiktokUser = { open_id: account.providerAccountId };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken && session) {
        session.accessToken = token.accessToken as string;
      }
      if (session?.user && token.id) {
        session.user.id = token.id as string;
        if (token.tiktokUser) {
          session.user.tiktok = token.tiktokUser as any; // Ensure type compatibility
        }
      }
      return session;
    },
  },
});
