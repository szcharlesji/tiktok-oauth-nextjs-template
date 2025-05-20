import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const state = crypto.randomUUID();
  // Construct redirectUri cleanly from the request's origin
  const redirectUri = process.env.TIKTOK_REDIRECT_URI as string;

  const tikTokAuthUrl = new URL("https://www.tiktok.com/v2/auth/authorize");
  tikTokAuthUrl.searchParams.set("client_key", process.env.TIKTOK_CLIENT_KEY!);
  tikTokAuthUrl.searchParams.set("redirect_uri", redirectUri);
  tikTokAuthUrl.searchParams.set("response_type", "code");
  tikTokAuthUrl.searchParams.set("scope", "user.info.profile");
  tikTokAuthUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(tikTokAuthUrl);
  res.cookies.set("tiktok_oauth_state", state, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
  });
  return res;
}
