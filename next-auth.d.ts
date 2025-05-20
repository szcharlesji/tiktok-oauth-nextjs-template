import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | null; // open_id from TikTok
      tiktok?: { // Your custom TikTok user data structure
        open_id?: string;
        union_id?: string;
        display_name?: string;
        avatar_url?: string;
      };
    } & DefaultSession["user"]; // Keep existing properties like name, email, image
  }

  // The User object from the database, and also what's passed to JWT callback after profile mapping
  interface User extends DefaultUser {
    // Add any custom fields you expect on the User object
    // For example, if you store the tiktokOpenId directly on the User model:
    // tiktokOpenId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    id?: string; // Mapped from user.id (open_id)
    open_id?: string; // From account.providerAccountId (raw open_id from TikTok)
    tiktokUser?: { // Raw user info fetched from TikTok, stored in token
      open_id?: string;
      union_id?: string;
      display_name?: string;
      avatar_url?: string;
    };
  }
} 